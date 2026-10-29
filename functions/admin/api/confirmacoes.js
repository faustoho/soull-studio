const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function onRequestGet({request,env}) {
  const assertion=request.headers.get('Cf-Access-Jwt-Assertion');
  if(!assertion || !env.ACCESS_AUD || !env.ACCESS_TEAM_DOMAIN) return json({error:'Acesso não autorizado.'},401);
  // Never trust the assertion header alone: validate signature, audience, issuer and expiry.
  const team=env.ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//,'').replace(/\/$/,'');
  if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/i.test(team)) return json({error:'Configuração de acesso inválida.'},503);
  try {
    const jwks=await fetch('https://'+team+'/cdn-cgi/access/certs').then(r=>{if(!r.ok)throw Error('jwks');return r.json()});
    const [header,payload,signature]=assertion.split('.');
    if(!header||!payload||!signature)throw Error('jwt');
    const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0));
    const h=JSON.parse(new TextDecoder().decode(decode(header)));
    const p=JSON.parse(new TextDecoder().decode(decode(payload)));
    if(h.alg!=='RS256'||!h.kid||!Array.isArray(p.aud)||!p.aud.includes(env.ACCESS_AUD)||p.iss!=='https://'+team||!Number.isFinite(p.exp)||p.exp<=Math.floor(Date.now()/1000)||!Number.isFinite(p.iat)||p.iat>Math.floor(Date.now()/1000)+60)throw Error('claims');
    const key=jwks.keys?.find(k=>k.kid===h.kid&&k.kty==='RSA');
    if(!key)throw Error('key');
    const cryptoKey=await crypto.subtle.importKey('jwk',key,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',cryptoKey,decode(signature),new TextEncoder().encode(header+'.'+payload)))throw Error('signature');
  }catch{return json({error:'Autenticação inválida.'},401)}
  if(!env.DB)return json({error:'Banco indisponível.'},503);
  const url=new URL(request.url);
  const search=(url.searchParams.get('q')||'').trim().slice(0,100);
  const format=url.searchParams.get('format');
  const limit=format==='csv'?5000:100;
  const where=search?' WHERE responsavel LIKE ? ESCAPE \'\\\' OR aluno LIKE ? ESCAPE \'\\\'':'';
  const sql='SELECT protocolo,responsavel,aluno,confirmado_em,versao_orientacoes FROM confirmacoes_leitura'+where+' ORDER BY confirmado_em DESC LIMIT ?';
  const escaped='%'+search.replace(/[\\%_]/g,'\\$&')+'%';
  try {
    const params=search?[escaped,escaped,limit]:[limit];
    const {results}=await env.DB.prepare(sql).bind(...params).all();
    if(format==='csv'){
      const esc=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/, m => "'"+m).replace(/"/g,'""')+'"';
      const cols=['protocolo','responsavel','aluno','confirmado_em','versao_orientacoes'];
      const csv='\uFEFF'+[cols.join(';'),...results.map(row=>cols.map(k=>esc(row[k])).join(';'))].join('\r\n');
      return new Response(csv,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="morada-confirmacoes.csv"','Cache-Control':'no-store'}});
    }
    return json({results,limit});
  }catch{return json({error:'Falha ao consultar confirmações.'},503)}
}
