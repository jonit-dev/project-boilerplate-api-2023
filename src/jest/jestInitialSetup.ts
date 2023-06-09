import "reflect-metadata";

import "express-async-errors";

import redis from "./redisV4Mock";

jest.setTimeout(30000);

jest.mock("redis", () => redis);

jest.mock("newrelic", () => ({
  startBackgroundTransaction: jest.fn(),
  endTransaction: jest.fn(),
  recordMetric: jest.fn(),
}));
