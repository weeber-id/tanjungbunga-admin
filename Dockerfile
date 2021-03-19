FROM node:12.14.1-alpine3.10

WORKDIR /app

COPY client/ ./
RUN rm yarn.lock
RUN npm install

ENV NODE_ENV=production
ENV IRON_SESSION_PASSWORD=aekos1ti7ahVae5Iaring8footiv7Aid7Eezaiha

RUN npm run build
CMD "npm" "run" "start"