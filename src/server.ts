import { appEnv } from "@providers/config/env";
import {
  characterConnection,
  cronJobs,
  db,
  mapLoader,
  npcManager,
  npcMetaDataLoader,
  seeds,
  server,
  socketAdapter,
} from "@providers/inversify/container";
import { errorHandlerMiddleware } from "@providers/middlewares/ErrorHandlerMiddleware";
import { PushNotificationHelper } from "@providers/pushNotification/PushNotificationHelper";
import { app } from "@providers/server/app";
import { router } from "@providers/server/Router";
import { EnvType } from "@rpg-engine/shared/dist";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import "express-async-errors";
import "reflect-metadata";

const port = appEnv.general.SERVER_PORT || 3002;

app.listen(port, async () => {
  server.showBootstrapMessage({
    appName: appEnv.general.APP_NAME!,
    port: appEnv.general.SERVER_PORT!,
    timezone: appEnv.general.TIMEZONE!,
    adminEmail: appEnv.general.ADMIN_EMAIL!,
    language: appEnv.general.LANGUAGE!,
    phoneLocale: appEnv.general.PHONE_LOCALE!,
  });

  await db.init();
  await cronJobs.start();
  await socketAdapter.init(appEnv.socket.type);

  mapLoader.init(); // must be the first thing loaded!
  npcMetaDataLoader.loadNPCMetaData(); //! This must come before our seeds.start(), otherwise it won't have the data to create our NPCs.

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(router);

  app.use(Sentry.Handlers.errorHandler());
  app.use(errorHandlerMiddleware);

  // Firebase-admin setup, that push notification requires.
  PushNotificationHelper.initialize();

  await seeds.start();

  //! TODO: Allocate according to pm2 instances

  await npcManager.init();

  await characterConnection.setAllCharactersAsOffline();

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
});
