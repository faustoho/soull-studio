# Área administrativa de confirmações — MORADA 2026

**NÃO publique esta branch antes de configurar Cloudflare Access.** A rota estática `/admin/confirmacoes/` contém somente a interface, mas deve ser bloqueada pelo Access para que apenas pessoas autorizadas a vejam. A API também verifica criptograficamente o JWT do Access.

## Configuração
1. Cloudflare Zero Trust → Access → Applications → Add application → Self-hosted.
2. Domínio: `morada.soullstudiodeteatro.com.br`; path: `/admin/*`. Proteja todo o prefixo (interface e API). Não proteja `/api/confirmacoes`, pois ele recebe as confirmações das famílias.
3. Crie política **Allow** somente para os e-mails específicos dos administradores. Utilize autenticação por e-mail/OTP ou IdP; nunca uma política pública.
4. Em Pages → Settings → Variables and Secrets, configure `ACCESS_AUD` com o **Application Audience (AUD) Tag** do aplicativo Access, e `ACCESS_TEAM_DOMAIN` com o domínio da equipe no formato `sua-equipe.cloudflareaccess.com`. São configurações de servidor; não precisam constar no HTML.
5. Garanta que o binding `DB` já esteja presente em Production. Teste com usuário autorizado e com navegador anônimo sem login.
6. Verifique que a página e `/admin/api/confirmacoes` são inacessíveis sem login, e que a API só retorna dados com JWT válido.

A API retorna até 100 registros por consulta e exporta até 5000 por CSV. A busca filtra por responsável ou aluno. As datas são apresentadas no horário de Brasília. A exportação contém dados pessoais: guarde o CSV com segurança e defina uma política de retenção.

**Importante:** se o aplicativo Cloudflare Access estiver configurado com caminho específico demais, poderá proteger a interface mas não a API. Proteja todo `/admin/*`. O código valida assinatura, emissor, expiração e AUD; o bloqueio no edge é uma segunda camada.
