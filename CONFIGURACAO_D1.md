# Confirmação de leitura — MORADA 2026

A implementação está nesta branch para revisão; não publique antes de configurar e testar o D1.

1. No Cloudflare, crie um banco D1 (por exemplo `morada-confirmacoes`).
2. Execute o SQL de `migrations/0001_confirmacoes_leitura.sql` no console SQL do banco D1.
3. No projeto Cloudflare Pages do site, abra **Settings → Bindings → Add → D1 database**, configure a variável **DB** e selecione o banco criado. Configure para o ambiente de produção e, se usar preview, também para preview.
4. Garanta que o deploy do Cloudflare Pages reconheça a pasta `functions/` do repositório. Uma publicação somente estática não executa a API.
5. Teste o formulário na URL de preview, verifique uma linha no D1 e somente então faça merge para `main`.
6. Consulte os registros pelo painel privado D1 do Cloudflare (não há listagem pública). Exemplo: `SELECT protocolo, responsavel, aluno, confirmado_em, versao_orientacoes FROM confirmacoes_leitura ORDER BY confirmado_em DESC;`

O horário é registrado em UTC (ISO 8601) e exibido no navegador no fuso America/Sao_Paulo. A versão das orientações aceita é `morada-2026-orientacoes-v1`. Se o conteúdo das regras mudar substancialmente, atualize essa versão.

**Privacidade:** limitar acesso ao D1 a pessoas autorizadas, definir prazo de retenção e disponibilizar um canal de atendimento para solicitações de titulares. Não expor dados pessoais em endpoints públicos. O formulário não pede CPF nem contato. Há um campo invisível anti-spam básico, que não substitui proteção de taxa/WAF/Turnstile para uso público em escala. Antes de publicar, habilite proteção contra abuso no Cloudflare.
