# ─── Stage 1: builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Dependências nativas (bcrypt precisa de python/make/g++)
RUN apk add --no-cache python3 make g++ openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev

# Gera o Prisma Client
RUN npx prisma generate

# ─── Stage 2: produção ───────────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Copia apenas o necessário
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY src ./src
COPY public ./public
COPY package.json ./

# Porta exposta pela aplicação
EXPOSE 3000

# Garante schema aplicado e inicia o servidor
CMD ["sh", "-c", "npx prisma db push --skip-generate && node src/server.js"]
