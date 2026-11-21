# -*- coding: utf-8 -*-
"""A mascara de telefone dos 4 checkouts deixa o cliente apagar o DDD e corrigir o numero.

Roda tests/checkout_phone_mask_harness.js (node + vm, DOM dublado) contra cada bundle
servido, com os listeners reais do #cel. Antes, a mascara escrevia '(61) ' com 2 digitos e
recolocava o separador a cada backspace: o campo travava em '(61) '.
Doc: docs/modules/pagamentos/bugs/2026-11-21-mascara-de-telefone-do-checkout-impede-apagar-o-ddd.md
"""
import json
import os
import shutil
import subprocess
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
HARNESS = os.path.join(HERE, "checkout_phone_mask_harness.js")
NODE = shutil.which("node")

BUNDLES = [
    "checkout/js/bundle.js",
    "52emul/checkout2/js/bundle.js",
    "ps2/checkout2/js/bundle.js",
    "xbox360/checkout2/js/bundle.js",
]


def rodar(bundle, cenario):
    proc = subprocess.run(
        [NODE, HARNESS, bundle, json.dumps(cenario)],
        capture_output=True, text=True, encoding="utf-8", timeout=60,
    )
    if proc.returncode != 0:
        raise AssertionError(f"harness falhou ({bundle}): {proc.stderr}")
    return json.loads(proc.stdout)


@unittest.skipIf(NODE is None, "node nao instalado")
class TestMascaraDeTelefoneDoCheckout(unittest.TestCase):
    def test_backspace_no_fim_apaga_o_numero_inteiro_com_o_ddd(self):
        for b in BUNDLES:
            with self.subTest(bundle=b):
                r = rodar(b, {"value": "(61) 99999-9999", "steps": ["back:30"]})
                self.assertEqual(r[-1], {"value": "", "caret": 0})

    def test_backspace_passo_a_passo_passa_pelo_ddd(self):
        for b in BUNDLES:
            with self.subTest(bundle=b):
                r = rodar(b, {"value": "(61) 9", "steps": ["back:1", "back:1", "back:1"]})
                self.assertEqual([s["value"] for s in r], ["(61", "(6", ""])

    def test_corrige_o_ddd_e_redigita(self):
        for b in BUNDLES:
            with self.subTest(bundle=b):
                r = rodar(b, {"value": "(61) 99999-9999", "caret": 3,
                              "steps": ["back:2", "type:11"]})
                self.assertEqual(r[0]["value"], "(99) 9999-999")
                self.assertEqual(r[-1], {"value": "(11) 99999-9999", "caret": 3})

    def test_backspace_logo_depois_de_separador_apaga_o_digito_anterior(self):
        for b in BUNDLES:
            with self.subTest(bundle=b):
                # cursor depois de ') ' -> apaga o '1' do DDD
                r = rodar(b, {"value": "(61) 99999-9999", "caret": 5, "steps": ["back:1"]})
                self.assertEqual(r[0]["value"], "(69) 9999-9999")
                self.assertEqual(r[0]["caret"], 2)
                # cursor depois do '-' -> apaga o ultimo digito antes dele
                r = rodar(b, {"value": "(61) 99998-7654", "caret": 11, "steps": ["back:1"]})
                self.assertEqual(r[0]["value"], "(61) 9999-7654")

    def test_digitar_continua_com_a_mesma_mascara(self):
        for b in BUNDLES:
            with self.subTest(bundle=b):
                r = rodar(b, {"value": "", "steps": ["type:61", "type:9", "type:99998888"]})
                self.assertEqual(r[0]["value"], "(61")
                self.assertEqual(r[1]["value"], "(61) 9")
                self.assertEqual(r[2], {"value": "(61) 99999-8888", "caret": 15})
                r = rodar(b, {"value": "", "steps": ["type:6133334444"]})
                self.assertEqual(r[0]["value"], "(61) 3333-4444")


if __name__ == "__main__":
    unittest.main()
