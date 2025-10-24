#!/usr/bin/env bun

// Railway-compatible static file server
import { existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = resolve(__dirname, "dist")

console.log("🚀 Railway Frontend Server Starting...")
console.log("📁 Dist path:", distPath)
console.log("📁 Dist exists:", existsSync(distPath))

if (!existsSync(distPath)) {
  console.error("❌ Dist folder not found!")
  process.exit(1)
}

const port = process.env.PORT || 3000
console.log("🔧 Using port:", port)
console.log("🔧 Railway environment:", process.env.RAILWAY_ENVIRONMENT)

// Simple static server
const server = Bun.serve({
  port: Number(port),
  hostname: "0.0.0.0",
  fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname

    console.log("📥 Request:", path)

    // Health check endpoints
    if (path === "/health" || path === "/healthz" || path === "/ping") {
      return new Response("OK", {
        status: 200,
        headers: { "Content-Type": "text/plain" }
      })
    }

    // Railway health check
    if (path === "/" && req.headers.get("user-agent")?.includes("Railway")) {
      return new Response("OK", {
        status: 200,
        headers: { "Content-Type": "text/plain" }
      })
    }

    // Serve static files
    let filePath = path === "/" ? "/index.html" : path
    const file = Bun.file(resolve(distPath, "." + filePath))

    return file.exists().then((exists) => {
      if (exists) {
        console.log("✅ Serving:", filePath)
        return new Response(file)
      } else {
        console.log("❌ Not found:", filePath)
        // For SPA routing, serve index.html for non-asset requests
        if (!filePath.includes(".")) {
          return new Response(Bun.file(resolve(distPath, "index.html")))
        }
        return new Response("Not Found", { status: 404 })
      }
    })
  },
})

console.log(`✅ Server running on http://0.0.0.0:${server.port}`)
console.log("🎯 Ready to serve requests!")

// Keep process alive
process.on("SIGINT", () => {
  console.log("🛑 Shutting down...")
  process.exit(0)
})
