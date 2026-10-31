import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let port = parseInt(process.env.PORT || '3000', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') {
      reqPath = '/index.html';
    }

    let safePath = path.normalize(path.join(__dirname, reqPath));

    // Security: Disallow directory traversal outside of workspace root
    if (!safePath.startsWith(__dirname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    // Fallback routes: Handle style.css and main.js from root or subfolders seamlessly
    if (!fs.existsSync(safePath)) {
      if (reqPath === '/style.css' && fs.existsSync(path.join(__dirname, 'css', 'style.css'))) {
        safePath = path.join(__dirname, 'css', 'style.css');
      } else if (reqPath === '/css/style.css' && fs.existsSync(path.join(__dirname, 'style.css'))) {
        safePath = path.join(__dirname, 'style.css');
      } else if (reqPath === '/main.js' && fs.existsSync(path.join(__dirname, 'js', 'main.js'))) {
        safePath = path.join(__dirname, 'js', 'main.js');
      } else if (reqPath === '/js/main.js' && fs.existsSync(path.join(__dirname, 'main.js'))) {
        safePath = path.join(__dirname, 'main.js');
      }
    }

    fs.stat(safePath, (statErr, stats) => {
      if (statErr || !stats) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      let targetPath = safePath;
      if (stats.isDirectory()) {
        if (safePath === __dirname) {
          targetPath = path.join(__dirname, 'index.html');
        } else {
          res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('403 Forbidden: Directory listing denied');
          return;
        }
      }

      fs.readFile(targetPath, (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
          } else {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`Server Error: ${err.code}`);
          }
        } else {
          const ext = path.extname(targetPath).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
          });
          res.end(content);
        }
      });
    });
  } catch (ex) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = port + 1;
    console.warn(`Port ${port} is in use. Retrying on port ${nextPort}...`);
    port = nextPort;
    server.listen(port);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
