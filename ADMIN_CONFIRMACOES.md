# Área administrativa com senha — MORADA 2026

Esta branch **não deve ser publicada antes de configurar os segredos e executar a migração**.

## Preparação no Cloudflare

1. Em D1 → morada-confirmacoes → Console, execute o arquivo `migrations/0002_admin_login_limits.sql`.
2. No projeto Cloudflare Pages `soull-studio`, configure em **Production** duas variáveis do tipo **Secret**:
   - `ADMIN_PASSWORD`: senha administrativa forte, exclusiva, com pelo menos 16 caracteres. Nunca incluir no GitHub nem compartilhar no chat.
   - `ADMIN_SESSION_SECRET`: valor aleatório independente, com pelo menos 32 caracteres. Pode gerar no PowerShell: `-join ((1..48) | ForEach-Object { 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[(Get-Random -Maximum 62)] })` (para produção, prefira gerador criptograficamente seguro).
3. Confirme que o binding D1 `DB` existe no ambiente Production.
4. Após configuração, faça merge e aguarde deploy. Teste em janela anônima: `/admin/confirmacoes/`, login com senha correta, tentativa incorreta, busca, exportação, logout e acesso direto à API sem login (deve retornar 401).

A API usa cookie HttpOnly, Secure e SameSite=Strict, assinado com HMAC-SHA256 e validade de 8 horas. Tentativas incorretas: até 5 por IP a cada 15 minutos, persistidas no D1. Não há endpoint público para listagem. A página HTML de login é pública, mas os dados só são retornados após autenticação.

**Nota:** para proteção mais forte, considere futuramente Turnstile, MFA e políticas de retenção. A exportação CSV contém dados pessoais de menores; mantenha os arquivos protegidos.
