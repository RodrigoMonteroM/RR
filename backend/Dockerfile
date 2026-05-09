FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .

RUN DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy" bunx prisma generate

RUN groupadd -r appgroup && useradd -r -g appgroup appuser \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
