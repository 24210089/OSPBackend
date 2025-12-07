const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// const mongoSanitize = require("express-mongo-sanitize");
// const xssClean = require("xss-clean");
// const hpp = require("hpp");

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

const parseAllowedOrigins = () => {
  const { CORS_ORIGIN } = process.env;
  if (!CORS_ORIGIN) {
    return [];
  }

  return CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const buildCorsOptions = () => {
  const allowedOrigins = parseAllowedOrigins();
  const allowAllOrigins = allowedOrigins.includes("*");

  return {
    origin: (origin, callback) => {
      if (!origin || allowAllOrigins) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
      "X-CSRF-Token",
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  };
};

const buildHelmetConfig = () => {
  const allowedOrigins = parseAllowedOrigins();
  const allowAllOrigins = allowedOrigins.includes("*");
  const connectSrc = allowAllOrigins ? ["*"] : ["'self'", ...allowedOrigins];

  return {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "http://localhost:5000"],
        connectSrc: ["'self'", "http://localhost:5000", ...connectSrc],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  };
};

const generalRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // Higher limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const loginRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  max: process.env.NODE_ENV === "production" ? 5 : 50, // Higher limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please wait 15 minutes.",
  },
});

const applySecurityMiddlewares = (app) => {
  const corsOptions = buildCorsOptions();
  const helmetConfig = buildHelmetConfig();

  app.use(cors(corsOptions));
  app.use(helmet(helmetConfig));
  // app.use(hpp());
  // app.use(mongoSanitize());
  // app.use(xssClean());

  // Only apply rate limiting in production
  if (process.env.NODE_ENV === "production") {
    app.use(generalRateLimiter);
    app.use("/api/auth/login", loginRateLimiter);
  }
};

module.exports = {
  applySecurityMiddlewares,
  generalRateLimiter,
  loginRateLimiter,
};
