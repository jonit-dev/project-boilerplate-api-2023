/* eslint-disable no-async-promise-executor */
/* eslint-disable no-void */
import { appEnv } from "@providers/config/env";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

import mongoose from "mongoose";
import { applySpeedGooseCacheLayer } from "speedgoose";

@provideSingleton(RedisManager)
export class RedisManager {
  public client: RedisClientType;

  constructor() {}

  public connect(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const redisConnectionUrl = `redis://${appEnv.database.REDIS_CONTAINER}:${appEnv.database.REDIS_PORT}`;

      this.client = createClient({
        url: redisConnectionUrl,
      });

      this.client.on("error", (err) => {
        console.log("❌ Redis error:", err);
        reject(err); // If you want connection failures to reject the Promise
      });

      try {
        await this.client.connect();

        // @ts-ignore
        void applySpeedGooseCacheLayer(mongoose, {
          redisUri: redisConnectionUrl,
        });

        if (!appEnv.general.IS_UNIT_TEST) {
          console.log("✅ Redis Client Connected");
        }

        resolve();
      } catch (error) {
        console.log("❌ Redis initialization error: ", error);
        reject(error); // Reject the Promise if there's an error during connection
      }
    });
  }
}
