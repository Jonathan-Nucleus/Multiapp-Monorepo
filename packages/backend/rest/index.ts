import { Express } from "express";
import "dotenv/config";

import healthCheck from "./health";

export function initializeRestApi(app: Express): void {
  const hash =
    process.env.HEALTH_CHECK_HASH ??
    "1809f7cd0c75acf34f56d8c19782b99c6b5fcd14128a3cc79aca38a4f94af3ff";

  app.get(`/health/${hash}`, healthCheck);
}
