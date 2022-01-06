import apicache from "apicache-plus";
import Redis from "ioredis";

export const LONG_CACHE_DURATION = 60 * 60 * 23; // sec * min * hours =  23 hours

export const MEDIUM_CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 hours

export const SHORT_CACHE_DURATION = 1000 * 60 * 20; // 20 min;

const cacheWithRedis = apicache.options({
  redisClient: new Redis({
    host: process.env.REDIS_CONTAINER,
    port: process.env.REDIS_PORT,
  }),
  // enabled: process.env.ENV === "Production",
});

export { cacheWithRedis };
