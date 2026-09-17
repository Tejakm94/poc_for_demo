FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --no-fund --no-audit

COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "bin/www.js"]
