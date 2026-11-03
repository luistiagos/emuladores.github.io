# -*- coding: utf-8 -*-
"""O preco que o checkout por produto MOSTRA vem do banco, que e quem cobra.

Roda tests/checkout_principal_price_harness.js (node + vm, DOM e fetch dublados) contra
os tres {52emul,ps2,xbox360}/checkout2/js/bundle.js. Antes, a tela exibia a constante
BASE do bundle: a troca da Multigames para R$ 45,90 deixou a pagina em 45,90 cobrando 39.
Doc: docs/modules/lojas-produtos/bugs/2026-11-02-precos-hardcoded-descentralizados-em-prompts-e-paginas.md
"""
import json
import os
import shutil
import subprocess
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
HARNESS = os.path.join(HERE, "checkout_principal_price_harness.js")
NODE = shutil.which("node")

# produto -> (MAIN_PACKAGE_ID_OVERRIDE do index.html, constantes BASE.price e
# BASE.original_price do bundle)
PRODUTOS = {
    "52emul": (9021111, "R$ 45,90", "R$ 197,90"),
    "ps2": (9021115, "R$ 25,00", "R$ 199,00"),
    "xbox360": (9021119, "R$ 47,00", "R$ 299,00"),
}


def rodar(produto, cenario):
    proc = subprocess.run(
        [NODE, HARNESS, produto, json.dumps(cenario)],
        capture_output=True, text=True, encoding="utf-8", timeout=60,
    )
    if proc.returncode != 0:
        raise AssertionError(f"harness falhou ({produto}): {proc.stderr}")
    return json.loads(proc.stdout)


@unittest.skipIf(NODE is None, "node nao instalado")
class TestCheckoutPrecoPrincipalDoBanco(unittest.TestCase):
    def test_preco_da_api_aparece_no_avista_no_riscado_no_total_e_no_cartao(self):
        for produto, (pid, _, _) in PRODUTOS.items():
            with self.subTest(produto=produto):
                r = rodar(produto, {"mainPackageId": pid, "principal": {
                    "package_id": pid, "price": 12.34, "relprice": 99.9, "package_price": 1.0}})
                self.assertEqual(r["avista"], "R$ 12,34")
                self.assertEqual(r["total"], "R$ 12,34")
                self.assertEqual(r["strike"], "R$ 99,90")
                self.assertEqual(r["cartTotal"], 12.34)  # shared/payment.js::getCartTotal
                self.assertEqual(r["principalFetches"], 1)

    def test_sem_preco_no_storepackage_usa_o_do_package(self):
        # Mesma reserva de mercadopagohelper._order_item_price; relprice nulo mantem o riscado.
        for produto, (pid, _, riscado) in PRODUTOS.items():
            with self.subTest(produto=produto):
                r = rodar(produto, {"mainPackageId": pid, "principal": {
                    "package_id": pid, "price": None, "relprice": None, "package_price": 9.9}})
                self.assertEqual(r["avista"], "R$ 9,90")
                self.assertEqual(r["total"], "R$ 9,90")
                self.assertEqual(r["strike"], riscado)

    def test_api_fora_do_ar_mantem_a_constante(self):
        for produto, (pid, constante, _) in PRODUTOS.items():
            with self.subTest(produto=produto):
                r = rodar(produto, {"mainPackageId": pid, "principal": None})
                self.assertEqual(r["avista"], "HTML-avista")
                self.assertEqual(r["total"], constante)

    def test_principal_de_outro_pacote_nao_troca_o_preco(self):
        # ?storeid= troca a loja e mantem MAIN_PACKAGE_ID_OVERRIDE: o principal da outra
        # loja nao e o pacote que vai ser cobrado.
        for produto, (pid, constante, _) in PRODUTOS.items():
            with self.subTest(produto=produto):
                r = rodar(produto, {"mainPackageId": pid, "principal": {
                    "package_id": pid + 1, "price": 12.34, "relprice": 99.9}})
                self.assertEqual(r["total"], constante)
                self.assertEqual(r["avista"], "HTML-avista")

    def test_sem_override_resolve_id_e_preco_com_um_fetch_so(self):
        for produto, (pid, _, _) in PRODUTOS.items():
            with self.subTest(produto=produto):
                r = rodar(produto, {"mainPackageId": 0, "callEnsure": True, "principal": {
                    "package_id": pid, "price": 12.34, "relprice": 99.9}})
                self.assertEqual(r["mainPackageId"], pid)
                self.assertEqual(r["total"], "R$ 12,34")
                self.assertEqual(r["principalFetches"], 1)


if __name__ == "__main__":
    unittest.main()
