FROM node:18-alpine

RUN mkdir /bot
WORKDIR /bot

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
