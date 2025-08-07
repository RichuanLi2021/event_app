import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { Express } from "express";
import { parsedEnv } from "../config/env";

export function applySecurity(app: Express): void {
  const allowedOrigins = parsedEnv.ALLOWED_ORIGINS;
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use(cookieParser());
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
          frameAncestors: ["'self'"],
          formAction: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
        },
      },
    })
  );

  app.use((_req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), fullscreen=()"
    );
    next();
  });

  const isPerfTest = process.env.PERF === "true";
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: isPerfTest ? 10_000 : 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}