import "express-async-errors";
import "reflect-metadata";

import { appEnv } from "@providers/config/env";
import {
  cronJobs,
  database,
  newRelic,
  redisManager,
  serverBootstrap,
  serverHelper,
  socketAdapter,
} from "@providers/inversify/container";
import { errorHandlerMiddleware } from "@providers/middlewares/ErrorHandlerMiddleware";
import { router } from "@providers/server/Router";
import { app } from "@providers/server/app";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { EnvType } from "@rpg-engine/shared/dist";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

const port = appEnv.general.SERVER_PORT || 3002;

dayjs.extend(duration);

if (!appEnv.general.IS_UNIT_TEST) {
  require("newrelic");
}

const startTime = Date.now();

const server = app.listen(port, async () => {
  await newRelic.trackTransaction(
    NewRelicTransactionCategory.Operation,
    "ServerBootstrap",
    async () => {
      // Run database and Redis initialization tasks in parallel
      await Promise.all([database.initialize(), redisManager.connect(), socketAdapter.init(appEnv.socket.type)]);

      // Start cron jobs
      cronJobs.start();

      app.use(router);

      app.use(errorHandlerMiddleware);

      // Perform server bootstrap operations
      await serverBootstrap.performOneTimeOperations();
      await serverBootstrap.performMultipleInstancesOperations();

      if (appEnv.general.ENV === EnvType.Production) {
        console.log(`✅ Application started succesfully on PMID ${process.env.pm_id}`);
      }

      const endTime = Date.now();
      const bootstrapTime = endTime - startTime;

      serverHelper.showBootstrapMessage({
        appName: appEnv.general.APP_NAME!,
        port: appEnv.general.SERVER_PORT!,
        timezone: appEnv.general.TIMEZONE!,
        adminEmail: appEnv.general.ADMIN_EMAIL!,
        language: appEnv.general.LANGUAGE!,
        phoneLocale: appEnv.general.PHONE_LOCALE!,
        bootstrapTime,
      });
    },
    appEnv.general.ENV === EnvType.Development
  );
});

serverHelper.gracefullyShutdown(server);
