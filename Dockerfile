FROM node:20

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

COPY entrypoint.sh /app/entrypoint.sh

COPY . .

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]

CMD ["npm","run","start"]
