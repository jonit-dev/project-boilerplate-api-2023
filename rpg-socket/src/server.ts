import "reflect-metadata";
import cors from "cors";
import express from "express";
import { appEnv } from "./providers/constants/env";
import { GeckosServerHelper } from "./providers/geckos/GeckosServerHelper";
import { container, cronsManager } from "./providers/inversify/inversify";
import { serverRouter } from "./resources/server/server.routes";

const app = express();

// Middlewares ========================================

app.use(serverRouter);

app.use(cors());

// static public path
app.use(express.static("public"));

const server = app.listen(appEnv.port.server, () => {
  console.log(`⚙️ Geckos Express Port: ${appEnv.port.server} - UDP Port: ${appEnv.port.socket}`);

  const geckosServer = container.get<GeckosServerHelper>(GeckosServerHelper);
  geckosServer.init(server);
  cronsManager.scheduleAllCrons();
});
