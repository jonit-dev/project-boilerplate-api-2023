import "reflect-metadata";

import "express-async-errors";

import redis from "./redisV4Mock";

jest.setTimeout(30000);

jest.mock("redis", () => redis);
