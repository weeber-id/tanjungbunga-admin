# Tanjung Bunga Content Management System for Administrator

This is explanation how to build the app

## Setup Environment

some environment need to be setted in order the app can work correctly, put this code below inside your `Dockerfile`

```bash
ENV NODE_ENV production
ENV IRON_SESSION_PASSWORD {YOUR_SECRET_PASSWORD} # length must be higher than 32 chars
```

## Build the App

```bash
# yarn package

cd client && yarn build
cd client && yarn start


# if you are using npm

sudo rm -rf client/yarn.lock
cd client && npm run build
cd client && npm start
```

## Full Explanation

See the full explanation how to deploy [Nextjs](https://nextjs.org) app on this [link](https://nextjs.org/docs/deployment#vercel-recommended).

## Setup HTTPS for localhost development

### 1) Create Private Key

```bash
openssl req \
 -new -sha256 -nodes \
 -out localhost.csr \
 -newkey rsa:2048 -keyout localhost.key
```

### 2) Create New Certificate using rootSSL

```bash
openssl req -x509 -out localhost.crt -keyout localhost.key \
-newkey rsa:2048 -nodes -sha256 \
-subj '/CN=web-localhost.weeber.id' -extensions EXT -config <( \
printf "[dn]\nCN=web-localhost.weeber.id\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:web-localhost.weeber.id\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

### 3) Add this code inside your custom server file

before run the script make sure to put certificates that you just created, inside the `certificates/` folder. The name of the files would be :

1. `localhost.crt`
1. `localhost.key`

```javascript
// inside server/index.ts

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
```
