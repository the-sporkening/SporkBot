FROM node:10.15.3-alpine as builder

RUN \
    apk add git g++ gcc libgcc libstdc++ linux-headers make python && \
    npm install npm@latest -g && \
    npm install node-gyp -g

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install

FROM node:10.15.3-alpine

RUN apk add ffmpeg
USER node
WORKDIR /home/node/app
COPY --chown=node:node . .
COPY --from=builder /home/node/app/node_modules /home/node/app/node_modules

CMD [ "node", "Mage.js" ]