import { EnvType } from "@project-remote-job-board/shared/dist";
import { appEnv } from "@providers/config/env";
import apicache from "apicache-plus";
import Redis from "ioredis";

export const LONG_CACHE_DURATION = 60 * 60 * 23; // sec * min * hours =  23 hours

export const MEDIUM_CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 hours

export const SHORT_CACHE_DURATION = 1000 * 60 * 20; // 20 min;

let cache;

switch (appEnv.general.ENV) {
  case EnvType.Development:
    cache = apicache.options({
      enabled: false,
    });
    break;
  case EnvType.Production:
    cache = apicache.options({
      redisClient: new Redis({
        host: appEnv.database.REDIS_CONTAINER,
        port: appEnv.database.REDIS_PORT,
      }),
    });
    break;
}

export { cache };
