const noStore={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const json=(obj,status=200,extra={})=>new Response(JSON.stringify(obj),{status,headers:{...noStore,'Content-Type':'application/json; charset=utf-8',...extra}});
const enc=new TextEncoder();
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const key=secret=>crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
const sign=async(secret,value)=>b64(await crypto.subtle.sign('HMAC',await key(secret),enc.encode(value)));
const safeEqual=(a,b)=>{if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0};
const ready=env=>typeof env.ADMIN_PASSWORD==='string'&&env.ADMIN_PASSWORD.length>=16&&typeof env.ADMIN_SESSION_SECRET==='string'&&env.ADMIN_SESSION_SECRET.length>=32&&!!env.DB;
const cookie=request=>(request.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('morada_admin='))?.slice(13)||'';
const session=async(request,env)=>{
  const value=cookie(request),i=value.lastIndexOf('.');
  if(i<1)return false;
  const payload=value.slice(0,i),sig=value.slice(i+1);
  if(!safeEqual(sig,await sign(env.ADMIN_SESSION_SECRET,payload)))return false;
  const [expiry,nonce]=payload.split(':');
  return /^\d{10,13}$/.test(expiry)&&/^[0-9a-f-]{36}$/.test(nonce)&&Number(expiry)>Date.now();
};
const isSameOrigin=request=>{const origin=request.headers.get('Origin');return !!origin&&origin===new URL(request.url).origin};
export async function onRequestPost({request,env}){
  if(!ready(env))return json({error:'Administração ainda não configurada.'},503);
  if(!isSameOrigin(request))return json({error:'Origem inválida.'},403);
  const path=new URL(request.url).pathname;
  if(path==='/admin/api/login'){
    if(!(request.headers.get('Content-Type')||'').toLowerCase().includes('application/json'))return json({error:'Formato inválido.'},415);
    const ip=request.headers.get('CF-Connecting-IP')||'unknown';
    const id=b64(await crypto.subtle.digest('SHA-256',enc.encode(ip)));
    const now=Date.now(),windowMs=15*60*1000;
    try{
      const record=await env.DB.prepare('SELECT attempts,window_start FROM admin_login_limits WHERE id=?').bind(id).first();
      if(record&&now-record.window_start<windowMs&&record.attempts>=5)return json({error:'Muitas tentativas. Tente novamente em 15 minutos.'},429);
      let body;try{body=await request.json()}catch{return json({error:'Dados inválidos.'},400)}
      const provided=typeof body.password==='string'?body.password:'';
      if(provided.length>1024)return json({error:'Senha inválida.'},401);
      const actual=b64(await crypto.subtle.digest('SHA-256',enc.encode(provided)));
      const expected=b64(await crypto.subtle.digest('SHA-256',enc.encode(env.ADMIN_PASSWORD)));
      if(!safeEqual(actual,expected)){
        const attempts=record&&now-record.window_start<windowMs?record.attempts+1:1;
        const start=record&&now-record.window_start<windowMs?record.window_start:now;
        await env.DB.prepare('INSERT INTO admin_login_limits(id,attempts,window_start) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET attempts=excluded.attempts,window_start=excluded.window_start').bind(id,attempts,start).run();
        return json({error:'Senha incorreta.'},401);
      }
      await env.DB.prepare('DELETE FROM admin_login_limits WHERE id=?').bind(id).run();
      const payload=(now+8*60*60*1000)+':'+crypto.randomUUID();
      const token=payload+'.'+await sign(env.ADMIN_SESSION_SECRET,payload);
      return json({ok:true},200,{'Set-Cookie':'morada_admin='+token+'; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=28800'});
    }catch{return json({error:'Não foi possível autenticar.'},503)}
  }
  if(path==='/admin/api/logout'){
    return json({ok:true},200,{'Set-Cookie':'morada_admin=; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0'});
  }
  return json({error:'Não encontrado.'},404);
}
export async function onRequestGet({request,env}){
  if(!ready(env))return json({error:'Administração ainda não configurada.'},503);
  if(!await session(request,env))return json({error:'Acesso não autorizado.'},401);
  const url=new URL(request.url);
  if(url.pathname==='/admin/api/session')return json({ok:true});
  if(url.pathname!=='/admin/api/confirmacoes')return json({error:'Não encontrado.'},404);
  const search=(url.searchParams.get('q')||'').trim().slice(0,100);
  const format=url.searchParams.get('format');
  const limit=format==='csv'?5000:100;
  const where=search?' WHERE instr(lower(responsavel),lower(?))>0 OR instr(lower(aluno),lower(?))>0':'';
  const sql='SELECT protocolo,responsavel,aluno,confirmado_em,versao_orientacoes FROM confirmacoes_leitura'+where+' ORDER BY confirmado_em DESC LIMIT ?';
  try{
    const {results}=await env.DB.prepare(sql).bind(...(search?[search,search,limit]:[limit])).all();
    if(format==='csv'){
      const escape=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,m=>"'"+m).replace(/"/g,'""')+'"';
      const cols=['protocolo','responsavel','aluno','confirmado_em','versao_orientacoes'];
      const csv='\uFEFF'+[cols.join(';'),...results.map(row=>cols.map(c=>escape(row[c])).join(';'))].join('\r\n');
      return new Response(csv,{headers:{...noStore,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="morada-confirmacoes.csv"'}});
    }
    return json({results,limit});
  }catch{return json({error:'Falha ao consultar confirmações.'},503)}
}
