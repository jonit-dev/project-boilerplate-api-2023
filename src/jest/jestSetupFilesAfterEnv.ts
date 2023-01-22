import redis from "./redisV4Mock";
jest.mock("redis", () => redis);
