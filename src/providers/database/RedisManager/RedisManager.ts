/* eslint-disable no-async-promise-executor */
import { appEnv } from "@providers/config/env";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import IORedis from "ioredis";
import { RedisBareClient } from "./RedisBareClient";
import { RedisIOClient } from "./RedisIOClient";
@provideSingleton(RedisManager)
export class RedisManager {
  public client: IORedis.Redis | null = null;

  constructor(private redisBareClient: RedisBareClient, private redisIOClient: RedisIOClient) {}

  public async connect(): Promise<void> {
    // if we do already have a client, just return it
    if (this.client) {
      return;
    }

    if (appEnv.general.IS_UNIT_TEST) {
      this.client = await this.redisBareClient.connect();
    } else {
      this.client = await this.redisIOClient.connect();
    }
  }

  public async getClientCount(): Promise<number> {
    return await this.redisIOClient.getTotalConnectedClients();
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
    }
  }
}
