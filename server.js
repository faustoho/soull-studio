const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  let file;
  try{file=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  if(file==='/')file='/index.html';
  // Exponha apenas os arquivos públicos do site, nunca o briefing ou arquivos locais.
  if(!['/index.html','/styles.css','/app.js'].includes(file)&&!/^\/assets\/[a-zA-Z0-9._-]+$/.test(file)){res.writeHead(404).end('Não encontrado');return;}
  fs.readFile(path.join(root,file),(error,data)=>{if(error){res.writeHead(404).end('Não encontrado');return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data);});
});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
