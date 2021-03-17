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
