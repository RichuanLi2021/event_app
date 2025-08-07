import client, { Counter } from "prom-client";
import compression from "compression";
import morgan from "morgan";
import { Express } from "express";

export function applyObservability(app: Express) {
  client.collectDefaultMetrics(); // process metrics

  const httpRequestDuration = new client.Histogram({ // custom metrics
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1, 5],
  });
  const httpRequestsTotal = new Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
  });

  // timing and counting
  app.use((req, res, next) => {
  const endTimer = httpRequestDuration.startTimer({
    method: req.method,
    route: req.route?.path || req.path,
  });
  res.on("finish", () => {
    endTimer({ status_code: res.statusCode });
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
  });
  next();
});

  app.use(compression({ level: 6 }));
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // expose /metrics
  app.get("/metrics", async (_req, res) => {
    try {
      res.setHeader("Content-Type", client.register.contentType);
      const metrics = await client.register.metrics();
      res.end(metrics);
    } catch (err: any) {
      res.status(500).end(err.message);
    }
  });

}