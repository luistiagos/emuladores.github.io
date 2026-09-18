# -*- coding: utf-8 -*-
import os
import re
import unittest

# Checkouts servidos e assets compartilhados
CHECKOUT_DIRS = [
    "checkout",
    "ps2/checkout2",
    "xbox360/checkout2",
    "52emul/checkout2",
    "shared",
]

# Padrões mais comuns de duplo-encode:
# 1. Ã seguido de caractere de continuação latino/pontuação (ex.: Ã¡, Ã£, Ã©, Ã“, etc.)
# 2. â€ seguido de caractere de pontuação (ex.: â€¢, â€œ, etc.)
# 3. â† seguido de caractere de pontuação/seta (ex.: â†’, etc.)
MOJIBAKE_PATTERN = re.compile(
    r"\u00c3[\u0080-\u00ff\u2010-\u2030]|\u00e2\u20ac[\u0080-\u00ff\u2010-\u2030]|\u00e2\u2020[\u0080-\u00ff\u2010-\u2030]"
)


class TestMojibakeGuard(unittest.TestCase):
    def test_sem_duplo_encode_em_checkouts_servidos(self):
        """Garante que nenhum .js ou .html servido nos checkouts contenha mojibake/duplo-encoding."""
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        ocorrencias = []

        for cdir in CHECKOUT_DIRS:
            caminho_completo = os.path.join(base_dir, cdir)
            if not os.path.isdir(caminho_completo):
                continue

            for root, _, files in os.walk(caminho_completo):
                for f in files:
                    if not f.endswith((".js", ".html")):
                        continue
                    # Ignorar backups ou arquivos temporarios explicitamente nomeados como tal
                    if "_old" in f or "copy" in f:
                        continue

                    arquivo = os.path.join(root, f)
                    rel = os.path.relpath(arquivo, base_dir)

                    with open(arquivo, "r", encoding="utf-8", errors="replace") as fp:
                        for idx, linha in enumerate(fp, 1):
                            m = MOJIBAKE_PATTERN.search(linha)
                            if m:
                                ocorrencias.append(
                                    f"{rel}:{idx}: [{m.group(0)!r}] -> {linha.strip()[:80]}"
                                )

        msg = f"Encontradas {len(ocorrencias)} ocorrências de mojibake/duplo-encoding:\n" + "\n".join(
            ocorrencias
        )
        self.assertEqual(ocorrencias, [], msg)


if __name__ == "__main__":
    unittest.main()
