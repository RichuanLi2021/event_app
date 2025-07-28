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
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 60_000, // 1‑minute window
    max: 100,         // limit each IP to 100 requests / minute
    standardHeaders: true,
    legacyHeaders: false,
  })
);

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