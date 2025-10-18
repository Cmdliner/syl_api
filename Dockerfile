FROM node:latest

WORKDIR /app

COPY package*.json .

EXCLUDE node_modules

RUN pnpm install


COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]