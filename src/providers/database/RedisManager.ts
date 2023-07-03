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

  public async connect(): Promise<void> {
    const redisConnectionUrl = `redis://${appEnv.database.REDIS_CONTAINER}:${appEnv.database.REDIS_PORT}`;

    this.client = createClient({
      url: redisConnectionUrl,
    });
    try {
      await this.client.connect();

      // @ts-ignore
      void applySpeedGooseCacheLayer(mongoose, {
        redisUri: redisConnectionUrl,
        debugConfig: {
          enabled: true,
          debugModels: ["Skill"],
        },
      });

      if (!appEnv.general.IS_UNIT_TEST) {
        console.log("✅ Redis Client Connected");
      }
    } catch (error) {
      console.log("❌ Redis initialization error: ", error);
    }

    this.client.on("error", (err) => {
      console.log("❌ Redis error:", err);
    });
  }
}
