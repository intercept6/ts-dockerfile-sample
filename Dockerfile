FROM node:16.13.2-bullseye-slim

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

WORKDIR /opt/app
RUN chown node:node ./
USER node

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY --chown=node:node . .
RUN npm run build

CMD [ "node", "build/src/index.js" ]