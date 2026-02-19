# ================================
# Stage 1: Builder
# ================================
FROM node:22-alpine AS builder

# Dependências para compilar pacotes nativos (ex: bcrypt)
RUN apk add --no-cache python3 make g++ openssl

WORKDIR /app

# Copiar manifests primeiro (cache de layers)
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências (incluindo dev para o prisma generate)
RUN npm ci

# Gerar o Prisma Client
RUN npx prisma generate

# ================================
# Stage 2: Production
# ================================
FROM node:22-alpine AS production

# openssl para o Prisma; libstdc++ e libgcc para módulos nativos (bcrypt)
RUN apk add --no-cache openssl libstdc++ libgcc

WORKDIR /app

# Copiar dependências e prisma gerado do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copiar o código da aplicação
COPY package*.json ./
COPY src ./src
COPY public ./public

# Criar diretório de uploads e ajustar permissões
RUN mkdir -p /app/public/uploads && \
    chown -R node:node /app

USER node

EXPOSE 3000

# Script de entrada: sincroniza o schema com o banco e inicia o servidor
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node src/server.js"]
