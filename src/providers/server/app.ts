import "reflect-metadata";

import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { InversifyExpressServer } from "inversify-express-utils";
import morgan from "morgan";

import { container } from "../inversify/container";

const compression = require("compression");

const expressServer = new InversifyExpressServer(container);

// Global rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 1000 requests per minute
});

expressServer.setConfig((app) => {
  app.use(compression());
  app.use("*", cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use(express.static("public"));
  app.use(limiter);
});

const app = expressServer.build();

export { app };
