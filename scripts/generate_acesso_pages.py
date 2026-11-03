# -*- coding: utf-8 -*-
import os
import json

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
acesso_dir = os.path.join(base_dir, "acesso")

# Load compiled platforms
platforms_json_path = os.path.join(r"c:\projects\digitalstoregamesproject\scratch\compiled_platforms.json")
with open(platforms_json_path, "r", encoding="utf-8") as f:
    platforms = json.load(f)

print(f"Loaded {len(platforms)} platforms for acesso redirect generation.")

def make_redirect_html(target_url, title, heading):
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta http-equiv="refresh" content="0; url={target_url}">
  <script>
    (function() {{
      var target = '{target_url}' + window.location.search + window.location.hash;
      window.location.replace(target);
    }})();
  </script>
</head>
<body style="background:#080b11;color:#fff;font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:4rem 1.5rem;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;">
  <div style="max-width:420px;background:#0f172a;border:1px solid rgba(255,255,255,0.1);border-radius:1.25rem;padding:2.5rem;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
    <div style="font-size:2.5rem;margin-bottom:1rem;">🎮</div>
    <h1 style="font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">{heading}</h1>
    <p style="font-size:0.875rem;color:#94a3b8;margin:0 0 1.5rem 0;line-height:1.5;">
      Redirecionando para a nova Área de Membros oficial...
    </p>
    <a href="{target_url}" style="display:inline-block;padding:0.75rem 1.5rem;background:#10b981;color:#000;font-weight:700;font-size:0.85rem;border-radius:0.75rem;text-decoration:none;">
      Acessar Jogos
    </a>
  </div>
</body>
</html>
"""

created_count = 0
for p in platforms:
    plat_id = p["id"]
    plat_name = p["name"]
    sub_dir = os.path.join(acesso_dir, plat_id)
    os.makedirs(sub_dir, exist_ok=True)

    target_url = f"https://digitalmemberarea.digitalstoregames.com/acesso/{plat_id}"
    html = make_redirect_html(
        target_url=target_url,
        title=f"Downloads {plat_name} - Digital Store Games",
        heading=f"Catálogo {plat_name}"
    )

    out_file = os.path.join(sub_dir, "index.html")
    with open(out_file, "w", encoding="utf-8") as out_f:
        out_f.write(html)
    created_count += 1

print(f"Created/updated {created_count} platform subdirectories in acesso/ with redirect to digitalmemberarea.")

# Aliases
aliases = {
    "psx": "ps1",
    "lynx": "camplynx",
    "samcoupe": "simcoupe",
}

for alias_id, target_id in aliases.items():
    alias_dir = os.path.join(acesso_dir, alias_id)
    os.makedirs(alias_dir, exist_ok=True)
    target_url = f"https://digitalmemberarea.digitalstoregames.com/acesso/{target_id}"
    alias_html = make_redirect_html(
        target_url=target_url,
        title=f"Downloads - Digital Store Games",
        heading=f"Redirecionando para {target_id.upper()}..."
    )
    with open(os.path.join(alias_dir, "index.html"), "w", encoding="utf-8") as af:
        af.write(alias_html)
    print(f"Created alias directory {alias_id}/ -> {target_url}")

print("All acesso platform redirects generated successfully!")
