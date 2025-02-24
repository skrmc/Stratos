FROM docker.io/oven/bun:1.2.2
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
RUN bun add -d tsx
COPY . .
EXPOSE 3000
CMD ["bun", "run", "--watch", "src/index.ts"] 
