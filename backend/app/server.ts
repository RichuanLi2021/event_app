import express from "express";
import dotenv from "dotenv";
import { parsedEnv } from "./config/env";
import connectDB from "./config/database";
import apiRouter from "./index";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import { applyObservability } from "./global_middleware/observability";
import { applySecurity } from "./global_middleware/securityHeader";

dotenv.config();
const app = express();

app.disable("x-powered-by");

applyObservability(app);
applySecurity(app);

app.use(express.json());

app.get("/", (_req, res) => { res.json(`Hi, API is running on port ${parsedEnv.PORT}`)});
app.use("/api", apiRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
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