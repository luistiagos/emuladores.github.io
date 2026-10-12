# AGENTS.md — emuladores.github.io

Instruções para qualquer agente (Claude Code, Codex, Antigravity, Cursor) que crie ou altere
páginas neste repositório. Ele é publicado no GitHub Pages a cada push: tudo o que entra aqui
fica público, inclusive este arquivo. Não escreva aqui número de venda, token, dado de cliente
nem endereço de servidor interno.

As regras gerais do projeto (commit que cita o doc, árvore compartilhada entre sessões, fluxo de
bug e de funcionalidade) vivem no `AGENTS.md` do repositório raiz `digitalstoregamesproject`,
pasta que contém esta.

## Toda página pública nova captura a origem da visita

Página pública é qualquer página que alguém possa abrir por anúncio, link ou mensagem: landing,
oferta, checkout, área do cliente, acesso, recuperação de acesso, remarketing. Toda página
pública nova DEVE, no mesmo commit que a cria:

1. carregar a captura de origem compartilhada do repositório (parâmetros `utm_*`, `fbclid`,
   `ttclid`, `gclid`, página de origem, primeiro e último toque), nunca uma cópia da lógica
   dentro da página;
2. enviar o primeiro e o último toque guardados em toda chamada que grava lead ou pedido;
3. carregar os mesmos pixels que as outras páginas da mesma loja;
4. passar no teste de páginas (`python -m unittest discover -s tests`), que reprova página
   pública sem a captura.

Página que não é pública (template de e-mail, teste interno, cópia antiga que não é servida) só
fica de fora pela lista de isenções do teste, com o motivo escrito ao lado. Página fora da lista e
sem a captura reprova.

Anúncio novo segue a convenção de parâmetros de URL da change abaixo. Sem ela a venda não aparece
na campanha certa.

**Por que:** sem os parâmetros de origem não dá para separar anúncio pago de post orgânico, saber
qual campanha vendeu, nem dizer de onde veio quem não clicou no Meta. Até outubro de 2026 nenhuma
página lia UTM, e o campo de campanha dos pedidos ficava vazio.

**Estado em 2026-10-12:** a captura compartilhada e o teste de páginas estão em construção na
change `docs/modules/lojas-produtos/changes/2026-10-12-captura-de-origem-em-todas-as-paginas/` do
repositório raiz. Enquanto ela não estiver no ar, página nova entra na lista de páginas dessa
change, para receber a captura junto com as demais. Quando a captura existir, esta seção ganha o
nome exato do script e do teste.
