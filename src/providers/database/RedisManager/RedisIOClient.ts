import { NewRelic } from "@providers/analytics/NewRelic";
import { appEnv } from "@providers/config/env";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import IORedis from "ioredis";
import mongoose from "mongoose";
import { applySpeedGooseCacheLayer } from "speedgoose";

//! We use RedisIOClient because it has a built in pooling mechanism
@provideSingleton(RedisIOClient)
export class RedisIOClient {
  public client: IORedis.Redis | null = null;

  constructor(private newRelic: NewRelic) {}

  public async connect(): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      try {
        const redisConnectionUrl = `redis://${appEnv.database.REDIS_CONTAINER}:${appEnv.database.REDIS_PORT}`;

        this.client = new IORedis(redisConnectionUrl, {
          maxRetriesPerRequest: null, // Disables the retry mechanism for individual commands; be cautious
          enableAutoPipelining: true, // Enables command pipelining for better performance
          keepAlive: 3000, // Keeps idle sockets open for 3 seconds; however, this doesn't close idle connections
          connectTimeout: 10000, // 10 seconds to timeout if a connection can't be established
          lazyConnect: true, // Connection will be lazily created on the first command
          autoResendUnfulfilledCommands: false, // Prevents re-sending of queued commands on reconnect, avoiding command duplication
        });

        this.client.setMaxListeners(20);

        if (!appEnv.general.IS_UNIT_TEST) {
          this.client.on("connect", () => {
            if (!appEnv.general.IS_UNIT_TEST) {
              console.log("✅ Redis Client Connected");
            }
          });
        }

        this.client.on("error", (err) => {
          console.log("❌ Redis error:", err);

          this.client?.disconnect();
          this.client?.removeAllListeners("error");

          this.client = null;

          reject(err);
        });

        // @ts-ignore
        void applySpeedGooseCacheLayer(mongoose, {
          redisUri: redisConnectionUrl,
        });

        // track new client
        this.newRelic.trackMetric(NewRelicMetricCategory.Count, NewRelicSubCategory.Server, "RedisClient", 1);

        resolve(this.client);
      } catch (error) {
        if (!appEnv.general.IS_UNIT_TEST) {
          this.client?.removeAllListeners("error");
        }

        console.log("❌ Redis initialization error: ", error);
        reject(error);
      }
    });
  }

  public async getTotalConnectedClients(): Promise<number> {
    let clientCount = 0;

    try {
      const clientList = await this.client.client("LIST"); // Assuming this.client is the IORedis client
      clientCount = clientList.split("\n").length - 1; // Each client info is separated by a newline

      this.newRelic.trackMetric(
        NewRelicMetricCategory.Count,
        NewRelicSubCategory.Server,
        "RedisClientCount",
        clientCount
      );
    } catch (error) {
      console.error("Could not fetch the total number of connected clients", error);
    }
    return clientCount;
  }
}
