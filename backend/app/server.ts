import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { parsedEnv } from "./config/env";
import connectDB from "./config/database";
import apiRouter from "./index";
import cookieParser from "cookie-parser";
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
if (parsedEnv.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(cookieParser());

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