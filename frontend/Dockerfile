# Use official Bun image
FROM oven/bun:latest

# Create app directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN bun install

# Build the app
RUN bun run build

# Start command
CMD ["bun", "run", "start"]
