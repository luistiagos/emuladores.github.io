# -*- coding: utf-8 -*-
import os
import json

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
catalog_dir = os.path.join(base_dir, "catalog")
template_file = os.path.join(catalog_dir, "index.html")

with open(template_file, "r", encoding="utf-8") as f:
    template = f.read()

# Load compiled platforms
platforms_json_path = os.path.join(r"C:\projects\digitalstoregamesproject\scratch\compiled_platforms.json")
with open(platforms_json_path, "r", encoding="utf-8") as f:
    platforms = json.load(f)

print(f"Loaded {len(platforms)} platforms for generation.")

# 1. Create per-platform subdirectories and index.html
created_count = 0
for p in platforms:
    plat_id = p["id"]
    plat_name = p["name"]
    sub_dir = os.path.join(catalog_dir, plat_id)
    os.makedirs(sub_dir, exist_ok=True)

    # Adjust relative paths for subfolder
    sub_html = template.replace("./catalog.css", "../catalog.css")
    sub_html = sub_html.replace("./catalog.js", "../catalog.js")
    sub_html = sub_html.replace("../images/", "../../images/")
    sub_html = sub_html.replace('href="../"', 'href="../../"')
    sub_html = sub_html.replace('href="../areacliente/"', 'href="../../areacliente/"')
    sub_html = sub_html.replace('href="../recuperaracesso/"', 'href="../../recuperaracesso/"')
    sub_html = sub_html.replace('href="../termoservico.html"', 'href="../../termoservico.html"')
    sub_html = sub_html.replace('href="../politica-de-privacidade.html"', 'href="../../politica-de-privacidade.html"')

    # Insert default-platform meta tag
    meta_tag = f'<meta name="default-platform" content="{plat_id}">\n  <title>Catálogo Oficial {plat_name} - Digital Store Games</title>'
    sub_html = sub_html.replace("<title>Catálogo Oficial de Jogos - Digital Store Games</title>", meta_tag)

    out_file = os.path.join(sub_dir, "index.html")
    with open(out_file, "w", encoding="utf-8") as out_f:
        out_f.write(sub_html)
    created_count += 1

print(f"Created/updated {created_count} platform subdirectories with index.html.")

# 2. Aliases (e.g. psx -> ps1)
aliases = {
    "psx": "ps1",
    "lynx": "camplynx",
    "samcoupe": "simcoupe",
}

for alias_id, target_id in aliases.items():
    alias_dir = os.path.join(catalog_dir, alias_id)
    os.makedirs(alias_dir, exist_ok=True)
    alias_html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=../{target_id}/">
  <title>Redirecionando para o Catálogo...</title>
  <script>location.replace('../{target_id}/');</script>
</head>
<body style="background:#080b11;color:#fff;font-family:sans-serif;text-align:center;padding:3rem;">
  <p>Redirecionando para o catálogo oficial...</p>
  <p><a href="../{target_id}/" style="color:#0072ce;">Clique aqui se não for redirecionado automaticamente.</a></p>
</body>
</html>
"""
    with open(os.path.join(alias_dir, "index.html"), "w", encoding="utf-8") as af:
        af.write(alias_html)
    print(f"Created alias directory {alias_id}/ -> ../{target_id}/")

# 3. Legacy .html files redirecting to folders
redirect_map = {
    "ps2.html": "ps2",
    "wii.html": "wii",
    "ps3.html": "ps3",
    "ps1.html": "ps1",
    "psp.html": "psp",
    "dreamcast.html": "dreamcast",
    "xbox360.html": "xbox360",
    "switch.html": "switch",
    "ps2_futebol.html": "ps2_futebol",
    "ps2patchs_gta_games.html": "ps2patchs_gta_games",
}

for old_file, target in redirect_map.items():
    file_path = os.path.join(catalog_dir, old_file)
    content = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=./{target}/">
  <title>Redirecionando para o Catálogo...</title>
  <script>location.replace('./{target}/');</script>
</head>
<body style="background:#080b11;color:#fff;font-family:sans-serif;text-align:center;padding:3rem;">
  <p>Redirecionando para o novo catálogo...</p>
  <p><a href="./{target}/" style="color:#0072ce;">Clique aqui se não for redirecionado automaticamente.</a></p>
</body>
</html>
"""
    with open(file_path, "w", encoding="utf-8") as rf:
        rf.write(content)
    print(f"Updated redirect {old_file} -> {target}/")

print("All catalog pages generated successfully!")
