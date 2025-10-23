/**
 * Centralized configuration for the entire application
 * This file contains all configurable values that were previously hardcoded
 */

// Environment-based configuration
export const CONFIG = {
  // Server Configuration
  SERVER: {
    // Default ports
    FRONTEND_PORT: 6173,
    BACKEND_PORT: 3333,

    // Default hosts
    HOST: "0.0.0.0",
    LOCALHOST: "localhost",

    // Default URLs
    FRONTEND_URL: "http://localhost:6173",
    BACKEND_URL: "http://localhost:3333",

    // Production URLs (can be overridden by environment variables)
    PRODUCTION_FRONTEND_URL: "https://construct-flowfrontend-production.up.railway.app",
    PRODUCTION_BACKEND_URL: "https://construct-flowbackend-production.up.railway.app",

    // CORS configuration
    CORS_ORIGINS: {
      DEVELOPMENT: [
        "http://localhost:6173",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:6173"
      ],
      PRODUCTION: [
        "https://construct-flowfrontend-production.up.railway.app",
      ]
    },

    // CORS settings
    CORS_SETTINGS: {
      CREDENTIALS: true,
      ALLOWED_METHODS: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"] as string[],
      ALLOWED_HEADERS: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
      ] as string[],
      EXPOSE_HEADERS: ["Content-Length", "X-Foo", "X-Bar"] as string[],
      MAX_AGE: 86400, // 24 hours
      OPTIONS_SUCCESS_STATUS: 200
    },

    // HTTP status codes
    HTTP_STATUS: {
      OK: 200,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500,
      SERVICE_UNAVAILABLE: 503,
      REQUEST_TIMEOUT: 408,
      TOO_MANY_REQUESTS: 429
    }
  },

  // API Configuration
  API: {
    // API request limits and timeouts
    REQUEST_TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second

    // Rate limiting
    RATE_LIMIT_WINDOW: 60000, // 1 minute
    RATE_LIMIT_MAX_REQUESTS: 100,

    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },

  // Database Configuration
  DATABASE: {
    // Store file paths
    PROJECTS_STORE_PATH: "tmp/projects.json",

    // Backup settings
    BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    MAX_BACKUPS: 7
  },

  // Development Configuration
  DEVELOPMENT: {
    // Logging levels
    LOG_LEVEL: "info", // debug, info, warn, error

    // Debug settings
    ENABLE_DEBUG_LOGS: true,
    ENABLE_PERFORMANCE_LOGS: false,

    // Hot reload settings
    HOT_RELOAD_PORT: 5173
  },

  // Production Configuration
  PRODUCTION: {
    // Security settings
    ENABLE_CORS: true,
    ENABLE_RATE_LIMITING: true,
    ENABLE_REQUEST_LOGGING: true,

    // Performance settings
    ENABLE_COMPRESSION: true,
    ENABLE_CACHING: true,

    // Monitoring
    ENABLE_ERROR_TRACKING: true,
    ENABLE_PERFORMANCE_MONITORING: true
  }
} as const

// Environment variable helpers
export const ENV = {
  // Server URLs
  get FRONTEND_URL() {
    return process.env.VITE_FRONTEND_URL || CONFIG.SERVER.FRONTEND_URL
  },

  get BACKEND_URL() {
    return process.env.VITE_API_URL || CONFIG.SERVER.BACKEND_URL
  },

  get PRODUCTION_FRONTEND_URL() {
    return process.env.PRODUCTION_FRONTEND_URL || CONFIG.SERVER.PRODUCTION_FRONTEND_URL
  },

  get PRODUCTION_BACKEND_URL() {
    return process.env.PRODUCTION_BACKEND_URL || CONFIG.SERVER.PRODUCTION_BACKEND_URL
  },

  // Server Configuration
  get PORT() {
    return process.env.PORT ? parseInt(process.env.PORT) : CONFIG.SERVER.BACKEND_PORT
  },

  get HOST() {
    return process.env.HOST || CONFIG.SERVER.HOST
  },

  // Environment Detection
  get IS_PRODUCTION() {
    return process.env.NODE_ENV === "production"
  },

  get IS_DEVELOPMENT() {
    return process.env.NODE_ENV === "development" || !process.env.NODE_ENV
  },

  // Feature Flags
  get ENABLE_CACHING() {
    return process.env.ENABLE_CACHING !== "false"
  },

  get ENABLE_MOCK_SERVICES() {
    return process.env.ENABLE_MOCK_SERVICES === "true"
  },

  // CORS Configuration
  get ADDITIONAL_CORS_ORIGINS() {
    return process.env.ADDITIONAL_CORS_ORIGINS?.split(",").map((origin) => origin.trim()) || []
  },

  get DISABLE_CORS() {
    return process.env.DISABLE_CORS === "true"
  }
} as const

// Configuration validation
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Note: API key validation is now handled by ApiKeyManager
  // This validation is moved to the security module

  // Validate port ranges
  if (ENV.PORT < 1 || ENV.PORT > 65535) {
    errors.push("PORT must be between 1 and 65535")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Configuration getters for easy access
export const getConfig = () => CONFIG
export const getEnv = () => ENV

// Export types for TypeScript
export type Config = typeof CONFIG
export type Environment = typeof ENV