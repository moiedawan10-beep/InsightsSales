// local server for the mock data (emulator url: http://10.0.2.2:3001/v1/)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const ROOT = __dirname;

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.normalize(path.join(ROOT, urlPath));

    if (!file.startsWith(ROOT) || !file.endsWith('.json') || !fs.existsSync(file)) {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({Message: 'Not found'}));
      return;
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    fs.createReadStream(file).pipe(res);
    console.log(`${req.method} ${urlPath}`);
  })
  .listen(PORT, () => console.log(`Dummy API running on http://localhost:${PORT}/v1/`));
