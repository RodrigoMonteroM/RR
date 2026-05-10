FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .

# Genera Prisma Client con un dummy URL SQLite
RUN DATABASE_URL="file:./dev.db" bunx prisma generate

# Crea directory per il database SQLite e assegna permessi
RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data

RUN groupadd -r appgroup && useradd -r -g appgroup appuser \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
