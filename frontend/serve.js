#!/usr/bin/env bun

// Simple static file server for the built frontend
import { existsSync } from "fs"
import { resolve } from "path"

const distPath = resolve(import.meta.dir, "dist")

if (!existsSync(distPath)) {
  console.error("❌ Error: dist folder not found. Did you run 'bun run build'?")
  process.exit(1)
}

console.log("🚀 Starting Construct Flow Frontend Server...")
console.log(`📁 Serving from: ${distPath}`)

const port = process.env.PORT || 6173
const hostname = "0.0.0.0"

// Create a simple static file server using Bun
const server = Bun.serve({
  port: Number(port),
  hostname,
  fetch(req) {
    const url = new URL(req.url)
    let filePath = url.pathname

    // Handle root path
    if (filePath === "/") {
      filePath = "/index.html"
    }

    // Try to serve the file
    const file = Bun.file(resolve(distPath, "." + filePath))

    // If file doesn't exist and it's not an asset, serve index.html for SPA routing
    return file.exists().then((exists) => {
      if (exists) {
        return new Response(file)
      } else if (!filePath.includes(".")) {
        // No file extension means it's probably a SPA route
        return new Response(Bun.file(resolve(distPath, "index.html")))
      } else {
        return new Response("Not Found", { status: 404 })
      }
    })
  },
})

console.log(`✅ Server running on port ${server.port}`)
console.log(`🌐 Server URL: http://${hostname}:${server.port}`)
console.log(`📦 Environment: ${process.env.NODE_ENV || "production"}`)

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down server...")
  process.exit(0)
})

