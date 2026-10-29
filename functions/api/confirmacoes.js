const VERSION = 'morada-2026-orientacoes-v1';
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
export async function onRequestPost({ request, env }) {
  if (!env.DB) return reply({ ok: false, error: 'Serviço de confirmação indisponível.' }, 503);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return reply({ ok: false, error: 'Origem não permitida.' }, 403);
  const type = request.headers.get('Content-Type') || '';
  if (!type.toLowerCase().startsWith('application/json')) return reply({ ok: false, error: 'Formato inválido.' }, 415);
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > 4096) return reply({ ok: false, error: 'Requisição muito grande.' }, 413);
  let body;
  try { body = await request.json(); } catch { return reply({ ok: false, error: 'Dados inválidos.' }, 400); }
  const responsavel = typeof body.responsavel === 'string' ? body.responsavel.trim().replace(/\s+/g, ' ') : '';
  const aluno = typeof body.aluno === 'string' ? body.aluno.trim().replace(/\s+/g, ' ') : '';
  if (body.website) return reply({ ok: true, protocolo: 'recebido', confirmadoEm: new Date().toISOString() });
  if (!body.aceite || responsavel.length < 3 || aluno.length < 3 || responsavel.length > 120 || aluno.length > 120 || /[<>\x00-\x1f]/.test(responsavel + aluno)) {
    return reply({ ok: false, error: 'Informe os nomes completos e confirme a leitura.' }, 400);
  }
  const protocolo = crypto.randomUUID();
  const confirmadoEm = new Date().toISOString();
  try {
    await env.DB.prepare('INSERT INTO confirmacoes_leitura (protocolo, responsavel, aluno, confirmado_em, versao_orientacoes) VALUES (?, ?, ?, ?, ?)')
      .bind(protocolo, responsavel, aluno, confirmadoEm, VERSION).run();
    return reply({ ok: true, protocolo, confirmadoEm });
  } catch {
    return reply({ ok: false, error: 'Falha ao salvar a confirmação. Tente novamente.' }, 503);
  }
}
export function onRequestGet() { return reply({ ok: false, error: 'Método não permitido.' }, 405); }
