#!/usr/bin/env bun

// Simple static file server for the built frontend
import { existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

// Get the directory of this script
const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = resolve(__dirname, "dist")

console.log("🔍 Script directory:", __dirname)
console.log("🔍 Looking for dist at:", distPath)
console.log("🔍 Dist exists:", existsSync(distPath))

if (!existsSync(distPath)) {
  console.error("❌ Error: dist folder not found at:", distPath)
  console.error("Current working directory:", process.cwd())
  console.error("Script location:", __dirname)
  process.exit(1)
}

console.log("🚀 Starting Construct Flow Frontend Server...")
console.log(`📁 Serving from: ${distPath}`)

const port = process.env.PORT || 6173
const hostname = "0.0.0.0"

console.log("🔧 Environment variables:")
console.log("  PORT:", process.env.PORT)
console.log("  NODE_ENV:", process.env.NODE_ENV)
console.log("  RAILWAY_ENVIRONMENT:", process.env.RAILWAY_ENVIRONMENT)
console.log("🔧 Server will bind to:", `${hostname}:${port}`)

// Create a simple static file server using Bun
console.log("🔧 Creating Bun server...")

try {
  const server = Bun.serve({
    port: Number(port),
    hostname,
    fetch(req) {
      const url = new URL(req.url)
      let filePath = url.pathname

      // Health check endpoint
      if (filePath === "/health" || filePath === "/healthz") {
        return new Response("OK", { status: 200 })
      }

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

} catch (error) {
  console.error("❌ Failed to start server:", error)
  console.error("Error details:", error.message)
  console.error("Stack trace:", error.stack)
  process.exit(1)
}

