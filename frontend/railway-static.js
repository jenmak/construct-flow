#!/usr/bin/env bun

// Ultra-simple Railway static server
import { existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = resolve(__dirname, "dist")

console.log("🚀 Railway Static Server")
console.log("📁 Serving from:", distPath)
console.log("📁 Exists:", existsSync(distPath))

if (!existsSync(distPath)) {
  console.error("❌ No dist folder!")
  process.exit(1)
}

const port = process.env.PORT || 3000
console.log("🔧 Port:", port)

// Minimal server
Bun.serve({
  port: Number(port),
  hostname: "0.0.0.0",
  fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname

    // Health check
    if (path === "/health") {
      return new Response("OK")
    }

    // Serve files
    const filePath = path === "/" ? "/index.html" : path
    const file = Bun.file(resolve(distPath, "." + filePath))

    return file.exists().then(exists => {
      if (exists) {
        return new Response(file)
      } else {
        // SPA fallback
        return new Response(Bun.file(resolve(distPath, "index.html")))
      }
    })
  }
})

console.log(`✅ Server ready on port ${port}`)
