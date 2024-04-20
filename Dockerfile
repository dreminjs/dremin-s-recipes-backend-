FROM node:20

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

COPY . .

RUN npm i

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]

CMD ["npm","run","start"]
