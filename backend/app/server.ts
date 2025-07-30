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
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

dotenv.config();
const app = express();
const allowedOrigins = parsedEnv.ALLOWED_ORIGINS;

app.use((req, _res, next) => {
  console.log("Incoming Origin:", req.get("Origin"));
  next();
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
}));

if (parsedEnv.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());

app.use(helmet());
app.use((req, res, next) => {
  res.set('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});
app.use((_req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), fullscreen=()"
  );
  next();
});

app.use(rateLimit({
    windowMs: 60_000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(compression({ level: 6 }));

// Root health‑check
app.get("/", (_req, res) => {
  res.json(`Hi, this eventflow server API is running on port ${parsedEnv.PORT}`);
});
app.use("/api", apiRouter);

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