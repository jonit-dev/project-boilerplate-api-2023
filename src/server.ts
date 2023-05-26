import "reflect-metadata";

import "express-async-errors";

import { appEnv } from "@providers/config/env";
import {
  characterBuffActivator,
  characterConnection,
  characterFoodConsumption,
  characterMonitor,
  characterTextureChange,
  cronJobs,
  db,
  heapMonitor,
  mapLoader,
  npcManager,
  pm2Helper,
  redisManager,
  seeds,
  server,
  socketAdapter,
  spellSilencer,
} from "@providers/inversify/container";
import { errorHandlerMiddleware } from "@providers/middlewares/ErrorHandlerMiddleware";
import { PushNotificationHelper } from "@providers/pushNotification/PushNotificationHelper";
import { router } from "@providers/server/Router";
import { app } from "@providers/server/app";
import { EnvType } from "@rpg-engine/shared/dist";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

const port = appEnv.general.SERVER_PORT || 3002;

// load new relic if in production
if (appEnv.general.ENV === EnvType.Production) {
  require("newrelic");
}

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
  await redisManager.connect();

  await cronJobs.start();
  await socketAdapter.init(appEnv.socket.type);

  await mapLoader.init(); // must be the first thing loaded!

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(router);

  app.use(Sentry.Handlers.errorHandler());
  app.use(errorHandlerMiddleware);

  // Firebase-admin setup, that push notification requires.
  PushNotificationHelper.initialize();

  await npcManager.disableNPCBehaviors();

  await seeds.start();

  //! TODO: Load balance NPCs on PM2 instances
  npcManager.listenForBehaviorTrigger();

  await characterConnection.resetCharacterAttributes();

  await characterFoodConsumption.clearAllFoodConsumption();

  characterMonitor.monitor();

  await characterBuffActivator.disableAllTemporaryBuffsAllCharacters();

  await spellSilencer.removeAllSilence();

  await characterTextureChange.removeAllTextureChange();

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

    if (process.env.pm_id === pm2Helper.pickLastCPUInstance()) {
      heapMonitor.monitor();
    }
  }
});
