FROM node:lts-alpine

RUN apk add --no-cache make git dumb-init python openssl

WORKDIR /wildduck
COPY . .

RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN npm install && npm run bowerdeps

ENV WILDDUCK_APPDIR=/wildduck \
    WILDDUCK_CONFIG=/wildduck/config/default.toml \
    CMD_ARGS=""

CMD node ${WILDDUCK_APPDIR}/server.js --config=${WILDDUCK_CONFIG} ${CMD_ARGS}
