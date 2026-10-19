import os

catalog_dir = r"C:\projects\digitalstoregamesproject\emuladores.github.io\catalog"
template_file = os.path.join(catalog_dir, "index.html")

with open(template_file, "r", encoding="utf-8") as f:
    template = f.read()

platforms = [
    ("ps2", "PlayStation 2"),
    ("wii", "Nintendo Wii"),
    ("ps3", "PlayStation 3"),
    ("xbox360", "Xbox 360"),
    ("ps1", "PlayStation 1"),
    ("psp", "PlayStation Portable"),
    ("dreamcast", "Sega Dreamcast"),
    ("switch", "Nintendo Switch"),
    ("gamecube", "Nintendo GameCube"),
    ("nds", "Nintendo DS"),
    ("3ds", "Nintendo 3DS"),
    ("snes", "Super Nintendo"),
    ("n64", "Nintendo 64"),
    ("megadrive", "Mega Drive"),
    ("saturn", "Sega Saturn"),
    ("xbox", "Original Xbox"),
    ("ps2_futebol", "PS2 Patchs Futebol"),
    ("ps2patchs_gta_games", "PS2 Patchs GTA"),
]

# Create per-platform subdirectories and index.html
for plat_id, plat_name in platforms:
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
    print(f"Created {plat_id}/index.html")

# Update legacy redirect files
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
