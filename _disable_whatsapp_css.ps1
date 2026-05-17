# Comenta regras CSS relacionadas a WhatsApp em todos os .css

$ErrorActionPreference = 'Stop'
$root = 'e:\projects\emuladores.github.io'

# Regra .whatsapp-* ou .float-wa, possivelmente com seletor composto (descendentes, :hover etc)
# Match: seletor com .whatsapp-X ou .float-wa, ate ate o '}' de fechamento (1 nivel)
$RuleRegex = [regex]::new(
    '(?s)(?<![\w-])(?:\.(?:whatsapp[\w-]*|float-wa)|\.whatsapp[\w-]*)[^{}]*\{[^{}]*\}'
)

$report = New-Object System.Collections.Generic.List[string]
$totalReplacements = 0

$cssFiles = Get-ChildItem -Path $root -Recurse -Include *.css -File | Where-Object {
    $_.FullName -notmatch '\\node_modules\\'
}

Write-Host "Total CSS files: $($cssFiles.Count)"

foreach ($f in $cssFiles) {
    try {
        $raw = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        if ($raw -notmatch '(?i)whatsapp|float-wa') { continue }

        $isWppCss = $f.Name -ieq 'whatsapp.css'
        $perFile = 0

        if ($isWppCss) {
            # whatsapp.css inteiro -> comentar tudo
            if ($raw -notmatch '/\* WPP_DISABLED_START') {
                $safe = $raw -replace '\*/', '* /'
                $new = "/* WPP_DISABLED_START`r`n$safe`r`nWPP_DISABLED_END */"
                $perFile = 1
            } else {
                $new = $raw
            }
        } else {
            $new = $RuleRegex.Replace($raw, {
                param($m)
                $idx = $m.Index
                $before = $raw.Substring(0, $idx)
                $lastStart = $before.LastIndexOf('WPP_DISABLED_START')
                $lastEnd = $before.LastIndexOf('WPP_DISABLED_END')
                if ($lastStart -gt $lastEnd) { return $m.Value }
                $script:perFile++
                $safe = $m.Value -replace '\*/', '* /'
                return "/* WPP_DISABLED_START $safe WPP_DISABLED_END */"
            })
        }

        if ($perFile -gt 0 -and $new -ne $raw) {
            [System.IO.File]::WriteAllText(
                $f.FullName,
                $new,
                (New-Object System.Text.UTF8Encoding($false))
            )
            $totalReplacements += $perFile
            $report.Add(("{0,3}x  {1}" -f $perFile, $f.FullName.Substring($root.Length+1)))
        }
    } catch {
        Write-Warning "Falha em $($f.FullName): $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host ("CSS alterados: {0}  (total regras comentadas: {1})" -f $report.Count, $totalReplacements)
$report | ForEach-Object { Write-Host $_ }
