#!/usr/bin/env python3
"""Update gba_server.html:
- backup original
- remove <tr> rows where href contains "myrient"
- fetch HuggingFace dataset listing and append rows linking to HF files

Usage: python scripts/update_gba_table.py
"""
from __future__ import annotations
import os
import re
import sys
import shutil
import datetime
import urllib.parse
import html

try:
    import requests
except Exception:
    requests = None


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
HTML_PATH = os.path.join(ROOT, 'acesso', 'gba', 'gba_server.html')
HF_TREE_URL = 'https://huggingface.co/datasets/luistiagos/gba/tree/main'
HF_RESOLVE_BASE = 'https://huggingface.co/datasets/luistiagos/gba/resolve/main/'


def backup_file(path: str) -> str:
    ts = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    bak = f"{path}.bak.{ts}"
    shutil.copy2(path, bak)
    return bak


def read_html(path: str) -> str:
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        return f.read()


def write_html(path: str, text: str) -> None:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def remove_myrient_rows(tbody_inner: str) -> tuple[str, int]:
    rows = re.findall(r'(<tr[\s\S]*?<\/tr>)', tbody_inner, flags=re.IGNORECASE)
    kept: list[str] = []
    removed = 0
    for r in rows:
        if 'myrient' in r:
            removed += 1
        else:
            kept.append(r)
    return '\n'.join(kept), removed


def fetch_hf_file_list() -> list[tuple[str, str]]:
    """Return list of (encoded_path, display_name) for files in the HF dataset.

    Strategy:
    - Prefer `huggingface_hub.HfApi().list_repo_files` when available.
    - Fallback to scraping paginated `?page=N` views if needed.
    """
    files: list[tuple[str, str]] = []

    # Try huggingface_hub for a complete file list
    try:
        from huggingface_hub import HfApi  # type: ignore
        api = HfApi()
        repo_files = api.list_repo_files(repo_id='luistiagos/gba', repo_type='dataset')
        for f in repo_files:
            if not f.lower().endswith(('.gba', '.zip', '.7z', '.rar')):
                continue
            enc = urllib.parse.quote(f, safe='/')
            files.append((enc, f))
        if files:
            files.sort(key=lambda x: x[1].lower())
            return files
    except Exception as e:
        print('huggingface_hub not available or failed:', e, file=sys.stderr)

    # Fallback: try paginated HTML (best-effort)
    if not requests:
        print('requests not available; cannot fetch HuggingFace list', file=sys.stderr)
        return []

    seen = set()
    page = 1
    while True:
        url = HF_TREE_URL + f'?page={page}'
        try:
            resp = requests.get(url, timeout=30)
        except Exception as e:
            print('HTTP error fetching HF page:', e, file=sys.stderr)
            break
        if resp.status_code != 200:
            break
        html_text = resp.text
        pattern = re.compile(r'/datasets/luistiagos/gba/blob/main/([^"\)\'<>\s]+)', flags=re.IGNORECASE)
        found = False
        for m in pattern.finditer(html_text):
            enc = m.group(1)
            fname = urllib.parse.unquote(enc)
            if fname in seen:
                continue
            seen.add(fname)
            if not fname.lower().endswith(('.gba', '.zip', '.7z', '.rar')):
                continue
            enc_safe = urllib.parse.quote(fname, safe='/')
            files.append((enc_safe, fname))
            found = True
        if not found:
            break
        page += 1
        if page > 200:
            break

    files.sort(key=lambda x: x[1].lower())
    return files


def build_rows_from_hf(files: list[tuple[str, str]]) -> str:
    rows = []
    for enc, disp in files:
        href = HF_RESOLVE_BASE + enc + '?download=true'
        disp_esc = html.escape(disp)
        row = f'<tr><td><a href="{href}" referrerpolicy="no-referrer">{disp_esc}</a></td><td>-</td></tr>'
        rows.append(row)
    return '\n'.join(rows)


def main() -> int:
    if not os.path.exists(HTML_PATH):
        print('HTML file not found:', HTML_PATH, file=sys.stderr)
        return 2

    print('Backing up original file...')
    bak = backup_file(HTML_PATH)
    print('Backup created at', bak)

    txt = read_html(HTML_PATH)

    m = re.search(r'(<tbody[^>]*id="tableBody"[^>]*>)([\s\S]*?)(</tbody>)', txt, flags=re.IGNORECASE)
    if not m:
        print('tableBody not found in HTML', file=sys.stderr)
        return 3

    head, inner, tail = m.group(1), m.group(2), m.group(3)

    kept_html, removed_count = remove_myrient_rows(inner)
    print(f'Removed {removed_count} rows containing "myrient"')

    files = fetch_hf_file_list()
    print(f'Found {len(files)} files on HuggingFace (from listing)')

    hf_rows = build_rows_from_hf(files)

    new_inner = kept_html.strip() + '\n' + hf_rows

    new_txt = txt[:m.start(1)] + head + '\n' + new_inner + '\n' + tail + txt[m.end(3):]

    write_html(HTML_PATH, new_txt)
    print('HTML updated:', HTML_PATH)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
