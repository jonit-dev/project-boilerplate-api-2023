import "reflect-metadata";

import "express-async-errors";

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
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

const port = appEnv.general.SERVER_PORT || 3002;

if (!appEnv.general.IS_UNIT_TEST) {
  require("newrelic");
}

const server = app.listen(port, async () => {
  await newRelic.trackTransaction(
    NewRelicTransactionCategory.Operation,
    "ServerBootstrap",
    async () => {
      serverHelper.showBootstrapMessage({
        appName: appEnv.general.APP_NAME!,
        port: appEnv.general.SERVER_PORT!,
        timezone: appEnv.general.TIMEZONE!,
        adminEmail: appEnv.general.ADMIN_EMAIL!,
        language: appEnv.general.LANGUAGE!,
        phoneLocale: appEnv.general.PHONE_LOCALE!,
      });

      await database.initialize();
      await redisManager.connect();

      cronJobs.start();
      await socketAdapter.init(appEnv.socket.type);

      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
      app.use(router);

      app.use(Sentry.Handlers.errorHandler());
      app.use(errorHandlerMiddleware);

      //! Dev Warning: If you want to add a new operation on server bootstrap, make sure to add it to one of the methods below (check if needs to be executed in all PM2 instances or not.)

      await serverBootstrap.performOneTimeOperations();

      await serverBootstrap.performMultipleInstancesOperations();

      if (appEnv.general.ENV === EnvType.Production) {
        Sentry.init({
          dsn: appEnv.general.SENTRY_DNS_URL,
          integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // enable Express.js middleware tracing
            new Tracing.Integrations.Express({ app }),
          ],

          // Set tracesSampleRate to 1.0 to capture 100%
          // of transactions for performance monitoring.
          // We recommend adjusting this value in production
          tracesSampleRate: 1.0,
        });

        console.log(`✅ Application started succesfully on PMID ${process.env.pm_id}`);
      }
    },
    appEnv.general.ENV === EnvType.Development
  );
});

serverHelper.gracefullyShutdown(server);
