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

# Expose port
EXPOSE 8080

# Start command - use a simple HTTP server
CMD ["bun", "-e", "Bun.serve({port:8080,hostname:'0.0.0.0',fetch(req){return new Response('Hello from Railway!')}})"]
