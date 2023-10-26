/* eslint-disable no-async-promise-executor */
import { appEnv } from "@providers/config/env";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import mongoose from "mongoose";
import { createClient } from "redis";
import { applySpeedGooseCacheLayer } from "speedgoose";

//! in unit test, just use the traditional redis because its already being mocked by redisV4Mock and changing support to IORedis would be a pain

@provideSingleton(RedisBareClient)
export class RedisBareClient {
  public async connect(): Promise<void> {
    return await new Promise<void>(async (resolve, reject) => {
      let client;

      try {
        const redisConnectionUrl = `redis://${appEnv.database.REDIS_CONTAINER}:${appEnv.database.REDIS_PORT}`;

        client = createClient({
          url: redisConnectionUrl,
        });

        client.on("error", (err) => {
          console.log("❌ Redis error:", err);
          reject(err);
        });

        await client.connect();

        // @ts-ignore
        void applySpeedGooseCacheLayer(mongoose, {
          redisUri: redisConnectionUrl,
        });

        resolve(client);
      } catch (error) {
        console.log("❌ Redis initialization error: ", error);
        reject(error);
      }
    });
  }
}
