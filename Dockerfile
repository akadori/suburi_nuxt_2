FROM node:16.4.1

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./nuxt.config.js ./

RUN yarn

COPY ./src ./src
COPY ./tsconfig.json ./

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]