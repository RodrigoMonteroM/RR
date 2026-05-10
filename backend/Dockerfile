FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .

# Genera Prisma Client con un dummy URL SQLite
RUN DATABASE_URL="file:./dev.db" bunx prisma generate

# Crea utente/gruppo e directory per il database SQLite
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
RUN mkdir -p /app/data && chown -R appuser:appgroup /app /app/data

USER appuser

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
