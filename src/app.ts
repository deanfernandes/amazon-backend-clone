import express from "express";
import indexRouter from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import YAML from "yaml";

const file = fs.readFileSync("./openapi.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

const app = express();
app.use(express.json());
app.use("/api/v1", indexRouter);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
