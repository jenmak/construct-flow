import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "react"
    }),
    tailwindcss()
  ],
  clearScreen: false,
  server: {
    port: 6173,
    host: "0.0.0.0",
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "construct-flowfrontend-production.up.railway.app",
      ".railway.app" // Allow all Railway subdomains
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
