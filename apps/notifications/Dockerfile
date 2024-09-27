FROM node:alpine As development

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/notifications apps/notifications
COPY apps/main apps/main
COPY libs libs

RUN npm run build notifications

FROM node:alpine As production 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --prod

COPY --from=development /app/dist ./dist

CMD ["node", "dist/apps/notifications/main"]