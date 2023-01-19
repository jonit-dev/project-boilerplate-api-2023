import { appEnv } from "@providers/config/env";
import { RedisClientType } from "@redis/client";
import { provide } from "inversify-binding-decorators";
import { createClient } from "redis";

@provide(RedisHelper)
export class RedisHelper {
  public client: RedisClientType;

  constructor() {}

  public async connect(): Promise<void> {
    const redisConnectionUrl = `redis://${appEnv.database.REDIS_CONTAINER}:${appEnv.database.REDIS_PORT}`;

    console.log("Redis connection url", redisConnectionUrl);

    this.client = createClient({
      url: redisConnectionUrl,
    });

    await this.client
      .connect()
      .catch((err) => console.log("❌ Redis Client Error", err))
      .then(() => console.log("✅ Redis Client Connected"));
  }
}
