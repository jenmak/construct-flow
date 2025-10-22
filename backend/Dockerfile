FROM oven/bun:latest
WORKDIR /app

# copy only the backend first for faster installs
COPY apps/backend/package.json ./
# if you have a lockfile inside apps/backend, copy it too:
# COPY apps/backend/bun.lockb ./

RUN bun install

# now bring the backend source
COPY apps/backend ./

RUN bun run build
CMD ["bun", "run", "dev"]
