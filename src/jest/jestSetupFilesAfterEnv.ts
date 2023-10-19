/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { container, redisManager } from "@providers/inversify/container";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

jest.mock("speedgoose", () => ({
  clearCacheForKey: jest.fn(() => Promise.resolve()),
  applySpeedGooseCacheLayer: jest.fn(),
  SpeedGooseCacheAutoCleaner: jest.fn(),
}));

// @ts-ignore
mongoose.Query.prototype.cacheQuery = function () {
  // This is a no-op function
  return this;
};

jest.mock("mongoose-update-if-current", () => ({
  updateIfCurrentPlugin: jest.fn(), // mock the plugin because otherwise it will break many tests
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), {
    dbName: "test-database",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  await mongoose.connection.db.dropDatabase();

  await redisManager.connect();
});

afterAll(async () => {
  jest.clearAllTimers();

  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  await mongoServer.stop({
    doCleanup: true,
    force: true,
  });

  container.unload();

  await mongoose.disconnect();

  await redisManager.client.flushAll();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});
