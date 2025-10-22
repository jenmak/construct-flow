FROM oven/bun:latest
WORKDIR /app

COPY package.json ./
# if you have a lockfile inside backend, copy it too:
# COPY backend/bun.lockb ./

RUN bun install

# now bring the backend source
COPY backend ./

RUN bun run build
CMD ["bun", "run", "dev"]
