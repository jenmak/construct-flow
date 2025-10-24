#!/usr/bin/env bun

// Ultra-simple server for Railway
console.log("🚀 Starting simple server...")
console.log("🔧 Environment:", process.env.NODE_ENV)
console.log("🔧 Railway environment:", process.env.RAILWAY_ENVIRONMENT)
console.log("🔧 Current directory:", process.cwd())
console.log("🔧 Files in current directory:", await import("fs").then(fs => fs.readdirSync(".")))

const port = process.env.PORT || 3000
console.log("🔧 Port:", port)

// Check if dist folder exists
const distExists = await import("fs").then(fs => fs.existsSync("./dist"))
console.log("🔧 Dist folder exists:", distExists)
if (distExists) {
  const distFiles = await import("fs").then(fs => fs.readdirSync("./dist"))
  console.log("🔧 Dist files:", distFiles)
}

// Simple HTTP server with error handling
try {
  const server = Bun.serve({
    port: Number(port),
    hostname: "0.0.0.0",
    async fetch(req) {
      try {
        const url = new URL(req.url)
        const path = url.pathname

        console.log(`📥 ${req.method} ${path}`)
        
        // Serve static files
        const file = Bun.file(`./dist${path === "/" ? "/index.html" : path}`)

        if (await file.exists()) {
          return new Response(file)
        } else {
          // SPA fallback
          return new Response(Bun.file("./dist/index.html"))
        }
      } catch (error) {
        console.error("❌ Error handling request:", error)
        return new Response("Internal Server Error", { status: 500 })
      }
    }
  })

  console.log(`✅ Server running on port ${server.port}`)
  console.log("🌐 Server is ready to accept requests")

} catch (error) {
  console.error("❌ Failed to start server:", error)
  console.error("Error details:", error.message)
  console.error("Stack trace:", error.stack)
  process.exit(1)
}
