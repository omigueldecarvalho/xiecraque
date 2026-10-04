/* Servidor local opcional. O jogo também abre diretamente pelo index.html. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const infoPages = new Set(['sobre','privacidade','termos','fontes','contato','como-jogar','apoie']);
const cliPort = process.argv.indexOf('--port');
const port = Number(process.env.PORT || (cliPort >= 0 ? process.argv[cliPort + 1] : 4173));
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); res.end('Requisição inválida'); return; }
  // Public clean URLs match the sitemap; .html links keep working offline.
  const slug = pathname.slice(1).replace(/\/$/, '');
  const requested = pathname === '/' ? '/index.html' : infoPages.has(slug) ? '/' + slug + '.html' : pathname;
  const file = path.resolve(root, '.' + requested);
  if (!file.startsWith(root + path.sep) || /(^|\/)\./.test(pathname) || !Object.hasOwn(types,path.extname(file))) { res.writeHead(404); res.end('Arquivo não encontrado'); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Arquivo não encontrado'); return; }
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(data);
  });
});
server.listen(port, '0.0.0.0', () => console.log(`XI, é Craque pronto em http://localhost:${port}`));
