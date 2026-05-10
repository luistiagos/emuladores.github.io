import re
import csv
from pathlib import Path

# Ler o arquivo HTML
html_file = Path('ps2patchs_gta_games.html')
html_content = html_file.read_text(encoding='utf-8')

# Extrair os pares de href e texto dos links dentro da tabela
# Pattern para encontrar: <a href="URL" referrerpolicy="no-referrer">TEXTO</a>
link_pattern = r'<a href="([^"]+)"\s+referrerpolicy="no-referrer">([^<]+)</a>'
matches = re.findall(link_pattern, html_content)

# Filtrar URLs que NÃO terminam em .iso ou .ISO
non_iso_urls = []
for url, text in matches:
    if not url.endswith('.iso') and not url.endswith('.ISO'):
        non_iso_urls.append({
            'game': text.strip(),
            'url': url
        })

# Escrever em CSV
csv_file = Path('non_iso_urls.csv')
with open(csv_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['game', 'url'])
    writer.writeheader()
    writer.writerows(non_iso_urls)

print(f"Encontradas {len(non_iso_urls)} URLs sem arquivos .iso diretos")
print(f"Arquivo salvo em: {csv_file}")
