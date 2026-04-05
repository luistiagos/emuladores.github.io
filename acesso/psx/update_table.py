import csv, re

with open(r'e:\projects\emuladores.github.io\acesso\psx\psx.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = [r for r in reader if r['name'] != '.gitattributes']

html_rows = []
for r in rows:
    name = r['name'].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
    link = r['link']
    size = r['size']
    html_rows.append(f'<tr><td><a href="{link}" referrerpolicy="no-referrer">{name}</a></td><td>{size}</td></tr>')

new_tbody_content = '\n'.join(html_rows)

with open(r'e:\projects\emuladores.github.io\acesso\psx\psxchd.html', encoding='utf-8') as f:
    html = f.read()

new_html = re.sub(r'(<tbody id="tableBody">).*?(</tbody>)', r'\1' + '\n' + new_tbody_content + '\n' + r'\2', html, flags=re.DOTALL)

with open(r'e:\projects\emuladores.github.io\acesso\psx\psxchd.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print(f'Done. {len(rows)} rows written.')
