import { provide } from "inversify-binding-decorators";
import mongoose from "mongoose";

import { DB_POOL_SIZE } from "@providers/constants/DatabaseConstants";
import { appEnv } from "@providers/config/env";

@provide(Database)
export class Database {
  public async initialize(): Promise<void> {
    try {
      await mongoose.connect(
        `mongodb://${appEnv.database.MONGO_INITDB_ROOT_USERNAME}:${appEnv.database.MONGO_INITDB_ROOT_PASSWORD}@${appEnv.database.MONGO_HOST_CONTAINER}:${appEnv.database.MONGO_PORT}/${appEnv.database.MONGO_INITDB_DATABASE}?authSource=admin`,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          dbName: process.env.MONGO_INITDB_DATABASE,
          poolSize: DB_POOL_SIZE,
        }
      );
      console.log(
        `✅ Connected to the MongoDB database on Docker container ${appEnv.database.MONGO_HOST_CONTAINER} at port ${appEnv.database.MONGO_PORT}`
      );
    } catch (error) {
      console.error("❌ Error occurred while connecting to MongoDB:", error);
    }
  }

  public async close(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log(
        `✅ Disconnected from the MongoDB database on Docker container ${appEnv.database.MONGO_HOST_CONTAINER} at port ${appEnv.database.MONGO_PORT}`
      );
    } catch (error) {
      console.error("❌ Error occurred while disconnecting from MongoDB:", error);
    }
  }
}
