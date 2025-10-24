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
