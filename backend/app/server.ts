import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import { parsedEnv } from "./config/env";
import connectDB from "./config/database";
import apiRouter from "./index";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import client, { Counter } from "prom-client";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

dotenv.config();
const app = express();
const allowedOrigins = parsedEnv.ALLOWED_ORIGINS;


// 1. Collect default Node process metrics (CPU, memory, GC, etc.)
client.collectDefaultMetrics();

// 2. Customized HTTP metrics 
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1, 5],
});

// 2b. Total HTTP requests counter
const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// 3. HTTP request timing middleware
app.use((req, res, next) => {
  const endTimer = httpRequestDuration.startTimer({
    method: req.method,
    route: req.route?.path || req.path,
  });
  res.on("finish", () => {
    endTimer({ status_code: res.statusCode });
    // increment total counter
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
  });
  next();
});

// Check the origin
app.use((req, _res, next) => {
  console.log("Incoming Origin:", req.get("Origin"));
  next();
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// Compress all HTTP responses without putting high CPU pressure on this web server.
app.use(compression({ level: 6 }));
if (parsedEnv.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(cookieParser());

// Security headers and basic DoS protection
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://api.example.com"],

        // ZAP fall-backs:
        frameAncestors:["'self'"], 
        formAction:["'self'"],
        objectSrc:["'none'"],
        baseUri:["'self'"],
      },
    },
  })
);

// Add Cross-Origin-Embedder-Policy header
app.use((req, res, next) => {
  res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Permissions‑Policy: disallow camera, microphone, geolocation, fullscreen, etc.
app.use((_req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), fullscreen=()"
  );
  next();
});

const isPerfTest = process.env.PERF === "true";
app.use(
  rateLimit({
    windowMs: 60_000, // 1‑minute window
    max: isPerfTest ? 10_000 : 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Root health‑check
app.get("/", (_req, res) => {
  res.json(`Hi, this eventflow server API is running on port ${parsedEnv.PORT}`);
});

// explicitly added Routes for Static Files:
app.get('/robots.txt', (req, res) => {
  res.set('Content-Security-Policy', "default-src 'self'; frame-ancestors 'self'; form-action 'self';");
  res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  res.send('User-agent: *\nDisallow: /');
});
app.get('/sitemap.xml', (req, res) => {
  res.set('Content-Security-Policy', "default-src 'self'; frame-ancestors 'self'; form-action 'self';");
  res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  res.send('<urlset>...</urlset>');
});

app.use("/api", apiRouter);

app.get("/api/trigger-error", () => {
  throw new Error("💥 exploded");
});

// 4. Prometheus scrape endpoint
app.get("/metrics", async (_req, res) => {
  try {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (err: any) {
    res.status(500).end(err.message);
  }
});

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

(async () => {
  try {
    await connectDB();
    app.listen(parsedEnv.PORT, () => {
      console.log(`⚡  Server ready  →  http://localhost:${parsedEnv.PORT}`);
    });
  } catch (err) {
    console.error("❌  Startup failed:", err);
    process.exit(1);
  }
})();

export default app;