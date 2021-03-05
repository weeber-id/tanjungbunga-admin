import { createServer } from 'https';
import { parse } from 'url';
import fs from 'fs';
import path from 'path';
import next from 'next';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: true });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../certificates/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../certificates/localhost.crt')),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url!, true);

    handle(req, res, parsedUrl);
  }).listen(port);

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});
