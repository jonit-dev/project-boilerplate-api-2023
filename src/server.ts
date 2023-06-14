import "reflect-metadata";

import "express-async-errors";

import { appEnv } from "@providers/config/env";
import {
  cronJobs,
  db,
  mapLoader,
  newRelic,
  redisManager,
  server,
  serverBootstrap,
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

app.listen(port, async () => {
  await newRelic.trackTransaction(
    NewRelicTransactionCategory.Operation,
    "ServerBootstrap",
    async () => {
      server.showBootstrapMessage({
        appName: appEnv.general.APP_NAME!,
        port: appEnv.general.SERVER_PORT!,
        timezone: appEnv.general.TIMEZONE!,
        adminEmail: appEnv.general.ADMIN_EMAIL!,
        language: appEnv.general.LANGUAGE!,
        phoneLocale: appEnv.general.PHONE_LOCALE!,
      });

      await db.init();
      await redisManager.connect();

      cronJobs.start();
      await socketAdapter.init(appEnv.socket.type);

      await mapLoader.init(); // must be the first thing loaded!

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
      }
    },
    appEnv.general.ENV === EnvType.Development
  );
});
