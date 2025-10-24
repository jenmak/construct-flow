#!/usr/bin/env bun

// Ultra-simple server for Railway
console.log("🚀 Starting simple server...")

const port = process.env.PORT || 3000
console.log("🔧 Port:", port)

// Simple HTTP server
const server = Bun.serve({
  port: Number(port),
  hostname: "0.0.0.0",
  fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname
    
    console.log(`📥 ${req.method} ${path}`)
    
    // Health check
    if (path === "/health" || path === "/") {
      console.log("✅ Health check OK")
      return new Response("OK", { 
        status: 200,
        headers: { "Content-Type": "text/plain" }
      })
    }
    
    // Serve static files
    const file = Bun.file(`./dist${path === "/" ? "/index.html" : path}`)
    
    if (await file.exists()) {
      return new Response(file)
    } else {
      // SPA fallback
      return new Response(Bun.file("./dist/index.html"))
    }
  }
})

console.log(`✅ Server running on port ${server.port}`)
console.log("🌐 Health check: http://0.0.0.0:" + server.port + "/health")
