# MORADA 2026 — Soull Studio de Teatro

Site estático responsivo, desenvolvido com HTML, CSS e JavaScript, com base no briefing fornecido. Sem dependências de instalação. Marcas, lettering e cartaz originais em `assets/`.

## Executar

Com Node.js instalado, execute `npm run dev` e abra http://127.0.0.1:4173. Verificação de sintaxe: `npm run check`.

## Atualizar conteúdo

- `app.js`: `CLASSES` concentra as 10 turmas, cenas e datas. A chegada excepcional do CEI está em `arrival` e na programação. `credits` contém os créditos.
- `CONFIG.symplaUrl`: inserir o endereço HTTPS oficial enviado por Saulo. Enquanto vazio, o botão fica desabilitado, com aviso de disponibilidade futura. Cortesias têm link separado.
- `CONFIG.artisticText`: espaço para incluir o texto artístico integral em texto simples.
- `index.html`: orientações, sinopse, endereço e links de contato.
- `styles.css`: cores, layout e responsividade. Fontes Google Fonts com alternativas locais.
- Ilustrações vetoriais de calçados e caracterização são referências conceituais. Substituir por referências fotográficas aprovadas quando disponíveis.

## Pendências editoriais

Link definitivo da Sympla; conclusão da equipe de produção após Maduh e Gabriel Ribeiro; revisão da ficha técnica por Saulo; eventuais imagens em alta e referências fotográficas aprovadas. Nenhuma data, turma ou contato depende dessas pendências.

## GitHub e publicação

Enviar `index.html`, `styles.css`, `app.js`, `assets/`, `package.json`, `server.js`, `.gitignore` e este README. O briefing e as imagens originais da raiz estão ignorados para evitar publicação involuntária; os arquivos originais foram preservados.

O site pode ser hospedado no GitHub Pages, a partir da raiz da branch escolhida. Todos os caminhos dos assets são relativos, compatíveis com repositórios de projeto. Não há backend, formulário ou coleta de dados. `server.js` serve apenas para prévia local e não é necessário no GitHub Pages.
