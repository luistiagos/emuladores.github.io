# Script temporario para comentar referencias ao WhatsApp em todos os HTML
# Gerado automaticamente. Pode ser removido apos uso.

param(
    [switch]$DryRun = $false
)

$ErrorActionPreference = 'Stop'
$root = 'e:\projects\emuladores.github.io'

# Regex multi-linha para tags <a> apontando para WhatsApp
$AnchorRegex = [regex]::new(
    '(?is)<a\b[^>]*?\bhref\s*=\s*"[^"]*?(?:wa\.me|api\.whatsapp\.com|whatsapp\.com/send)[^"]*?"[^>]*?>.*?</a>'
)

# Regex para tags <link rel="..." href="..."> apontando para WhatsApp (dns-prefetch / preconnect / stylesheet)
$LinkRegex = [regex]::new(
    '(?is)<link\b[^>]*?\bhref\s*=\s*"[^"]*?(?:wa\.me|api\.whatsapp\.com|whatsapp\.com|whatsapp\.css)[^"]*?"[^>]*?/?>'
)

$report = New-Object System.Collections.Generic.List[string]
$totalReplacements = 0

$htmlFiles = Get-ChildItem -Path $root -Recurse -Include *.html -File | Where-Object {
    $_.FullName -notmatch '\\node_modules\\'
}

Write-Host "Total HTML files: $($htmlFiles.Count)"

foreach ($f in $htmlFiles) {
    try {
        $raw = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        if ($raw -notmatch '(?i)whatsapp|wa\.me') { continue }

        $perFile = 0
        # Pula tags ja comentadas (anchor)
        $new = $AnchorRegex.Replace($raw, {
            param($m)
            $idx = $m.Index
            # Verifica se este match esta dentro de <!-- WPP_DISABLED_START ... WPP_DISABLED_END -->
            $before = $raw.Substring(0, $idx)
            $lastStart = $before.LastIndexOf('WPP_DISABLED_START')
            $lastEnd = $before.LastIndexOf('WPP_DISABLED_END')
            if ($lastStart -gt $lastEnd) { return $m.Value }  # ja dentro de bloco
            $script:perFile++
            $inner = $m.Value -replace '--', '- -'
            return "<!-- WPP_DISABLED_START $inner WPP_DISABLED_END -->"
        })
        $new = $LinkRegex.Replace($new, {
            param($m)
            $idx = $m.Index
            $before = $new.Substring(0, $idx)
            $lastStart = $before.LastIndexOf('WPP_DISABLED_START')
            $lastEnd = $before.LastIndexOf('WPP_DISABLED_END')
            if ($lastStart -gt $lastEnd) { return $m.Value }
            $script:perFile++
            $inner = $m.Value -replace '--', '- -'
            return "<!-- WPP_DISABLED_START $inner WPP_DISABLED_END -->"
        })

        if ($perFile -gt 0 -and $new -ne $raw) {
            if (-not $DryRun) {
                [System.IO.File]::WriteAllText(
                    $f.FullName,
                    $new,
                    (New-Object System.Text.UTF8Encoding($false))
                )
            }
            $totalReplacements += $perFile
            $report.Add(("{0,3}x  {1}" -f $perFile, $f.FullName.Substring($root.Length+1)))
        }
    } catch {
        Write-Warning "Falha em $($f.FullName): $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host ("Arquivos alterados: {0}  (total de tags comentadas: {1})" -f $report.Count, $totalReplacements)
if ($DryRun) { Write-Host "[DRY-RUN] Nenhum arquivo foi gravado." -ForegroundColor Yellow }
$report | ForEach-Object { Write-Host $_ }
