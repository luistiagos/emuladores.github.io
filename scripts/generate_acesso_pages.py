# -*- coding: utf-8 -*-
import os
import json

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
acesso_dir = os.path.join(base_dir, "acesso")
template_file = os.path.join(acesso_dir, "index.html")

with open(template_file, "r", encoding="utf-8") as f:
    template = f.read()

# Load compiled platforms
platforms_json_path = os.path.join(r"c:\projects\digitalstoregamesproject\scratch\compiled_platforms.json")
with open(platforms_json_path, "r", encoding="utf-8") as f:
    platforms = json.load(f)

print(f"Loaded {len(platforms)} platforms for acesso generation.")

created_count = 0
for p in platforms:
    plat_id = p["id"]
    plat_name = p["name"]
    sub_dir = os.path.join(acesso_dir, plat_id)
    os.makedirs(sub_dir, exist_ok=True)

    # Adjust relative paths for subfolder
    sub_html = template.replace('href="../catalog/catalog.css', 'href="../../catalog/catalog.css')
    sub_html = sub_html.replace('href="./acesso.css', 'href="../acesso.css')
    sub_html = sub_html.replace('src="./acesso.js', 'src="../acesso.js')
    sub_html = sub_html.replace('href="../termoservico.html"', 'href="../../termoservico.html"')
    sub_html = sub_html.replace('href="../politica-de-privacidade.html"', 'href="../../politica-de-privacidade.html"')
    sub_html = sub_html.replace('href="../"', 'href="../../"')
    sub_html = sub_html.replace('href="./"', 'href="../"')

    # Insert preset script and default-platform meta tag
    meta_tag = f'<meta name="default-platform" content="{plat_id}">\n  <script>window.ACESSO_PRESET_PLATFORM = "{plat_id}";</script>\n  <title>Downloads {plat_name} - Digital Store Games</title>'
    sub_html = sub_html.replace("<title>Área de Acesso &amp; Downloads de Jogos - Digital Store Games</title>", meta_tag)

    out_file = os.path.join(sub_dir, "index.html")
    with open(out_file, "w", encoding="utf-8") as out_f:
        out_f.write(sub_html)
    created_count += 1

print(f"Created/updated {created_count} platform subdirectories in acesso/ with index.html.")

# Aliases
aliases = {
    "psx": "ps1",
    "lynx": "camplynx",
    "samcoupe": "simcoupe",
}

for alias_id, target_id in aliases.items():
    alias_dir = os.path.join(acesso_dir, alias_id)
    os.makedirs(alias_dir, exist_ok=True)
    alias_html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=../{target_id}/">
  <title>Redirecionando para Downloads...</title>
  <script>location.replace('../{target_id}/');</script>
</head>
<body style="background:#080b11;color:#fff;font-family:sans-serif;text-align:center;padding:3rem;">
  <p>Redirecionando para a área de downloads...</p>
  <p><a href="../{target_id}/" style="color:#10b981;">Clique aqui se não for redirecionado automaticamente.</a></p>
</body>
</html>
"""
    with open(os.path.join(alias_dir, "index.html"), "w", encoding="utf-8") as af:
        af.write(alias_html)
    print(f"Created alias directory {alias_id}/ -> ../{target_id}/")

print("All acesso platform pages generated successfully!")

