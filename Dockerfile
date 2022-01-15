FROM node:16.13.2-bullseye-slim

WORKDIR /opt/app
RUN chown node:node ./
USER node

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY --chown=node:node package.json  package-lock.json ./
RUN npm ci && npm cache clean --force

COPY --chown=node:node . .
RUN npm run build

CMD [ "node", "build/src/index.js" ]