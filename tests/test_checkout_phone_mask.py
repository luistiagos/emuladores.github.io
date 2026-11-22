# -*- coding: utf-8 -*-
"""A mascara de telefone dos 4 checkouts deixa o cliente apagar o DDD e corrigir o numero.

Roda tests/checkout_phone_mask_harness.js (node + vm, DOM dublado) contra cada bundle
servido, com os listeners reais do #cel. Antes, a mascara escrevia '(61) ' com 2 digitos e
recolocava o separador a cada backspace: o campo travava em '(61) '.
Doc: docs/modules/pagamentos/bugs/2026-11-21-mascara-de-telefone-do-checkout-impede-apagar-o-ddd.md
"""
import json
import os
import re
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

PAGINAS = [
    "checkout/index.html",
    "52emul/checkout2/index.html",
    "52emul/checkout2/index3.html",
    "ps2/checkout2/index.html",
    "ps2/checkout2/index2.html",
    "xbox360/checkout2/index.html",
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



def chamar(bundle, calls):
    return rodar(bundle, {"calls": calls})


@unittest.skipIf(NODE is None, "node nao instalado")
class TestMascaraInternacional(unittest.TestCase):
    """Numero de fora do pais: comeca com '+', sem mascara BR, 8 a 15 digitos.
    Doc: docs/modules/pagamentos/changes/2026-11-21-whatsapp-internacional-no-checkout/spec.md
    """

    def test_mais_entra_no_modo_internacional(self):
        for b in BUNDLES:
            with self.subTest(bundle=b):
                r = rodar(b, {"value": "", "steps": ["type:+", "type:3", "type:51912345678"]})
                self.assertEqual(r[0], {"value": "+", "caret": 1})
                self.assertEqual(r[1], {"value": "+3", "caret": 2})
                self.assertEqual(r[2], {"value": "+351912345678", "caret": 13})
                # letras e espacos somem; corta em 15 digitos
                self.assertEqual(
                    chamar(b, [["maskPhone", "+351 912 abc 345 678"],
                               ["maskPhone", "+1234567890123456789"],
                               ["maskPhone", " +44 7911-123456"]]),
                    ["+351912345678", "+123456789012345", "+447911123456"])

    def test_colar_numero_internacional(self):
        for b in BUNDLES:
            with self.subTest(bundle=b):
                r = rodar(b, {"value": "", "steps": ["type:+1 (415) 555-1234"]})
                self.assertEqual(r[-1], {"value": "+14155551234", "caret": 12})

    def test_validacao_internacional(self):
        casos = [
            ("+351912345678", True), ("+14155551234", True), ("+12345678", True),
            ("+123456789012345", True), ("+1234567", False), ("+1234567890123456", False),
            ("+0351912345678", False), ("+", False),
            # DDI 55 segue a regra BR (55 + 10 ou 11 digitos), como o backend
            ("+5561993761753", True), ("+556133334444", True), ("+55619999", False),
            # sem '+' nada muda
            ("(61) 99999-9999", True), ("(61) 9999-999", False),
        ]
        for b in BUNDLES:
            with self.subTest(bundle=b):
                r = chamar(b, [["isValidPhone", v] for v, _ in casos])
                self.assertEqual(dict(zip([v for v, _ in casos], r)), dict(casos))

    def test_apagar_o_mais_volta_ao_brasil(self):
        for b in BUNDLES:
            with self.subTest(bundle=b):
                r = rodar(b, {"value": "+61999998888", "caret": 1, "steps": ["back:1"]})
                self.assertEqual(r[0], {"value": "(61) 99999-8888", "caret": 0})
                # apagar o ultimo digito no modo internacional mantem o '+'
                r = rodar(b, {"value": "+351", "steps": ["back:3", "back:1"]})
                self.assertEqual(r[0], {"value": "+", "caret": 1})
                self.assertEqual(r[1], {"value": "", "caret": 0})


class TestCampoAceitaMais(unittest.TestCase):
    def test_teclado_e_pattern_aceitam_mais(self):
        for p in PAGINAS:
            with self.subTest(pagina=p):
                with open(os.path.join(HERE, "..", p), encoding="utf-8") as f:
                    html = f.read()
                tag = re.search(r'<input[^>]*id="cel"[^>]*>', html).group(0)
                # inputmode="numeric" abre teclado sem '+' no celular
                self.assertIn('inputmode="tel"', tag)
                self.assertIn(r"\+", re.search(r'pattern="([^"]*)"', tag).group(1))
                self.assertIn("+351", re.search(r'placeholder="([^"]*)"', tag).group(1))
                # maxlength corta o texto colado/autopreenchido ANTES do evento input:
                # '+1 (415) 555-1234' e '+55 61 99376-1753' tem 17 caracteres
                self.assertGreaterEqual(int(re.search(r'maxlength="(\d+)"', tag).group(1)), 20)


if __name__ == "__main__":
    unittest.main()
