import { provide } from "inversify-binding-decorators";
import mongoose from "mongoose";

import { appEnv } from "../../providers/config/env";
@provide(Database)
export class Database {
  public async init(): Promise<void> {
    return await new Promise((resolve, reject) => {
      try {
        mongoose.connect(
          `mongodb://${appEnv.database.MONGO_INITDB_ROOT_USERNAME}:${appEnv.database.MONGO_INITDB_ROOT_PASSWORD}@${appEnv.database.MONGO_HOST_CONTAINER}:${appEnv.database.MONGO_PORT}/${appEnv.database.MONGO_INITDB_DATABASE}?authSource=admin`,
          {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            dbName: process.env.MONGO_INITDB_DATABASE,
          },
          (err) => {
            if (err) {
              console.log("❌ Error while connecting to MongoDB!");
              console.log(err);
              return;
            }

            if (!err) {
              resolve();
            }

            console.log(
              `✅ Connected to mongodb database on Docker container ${appEnv.database.MONGO_HOST_CONTAINER} at port ${appEnv.database.MONGO_PORT}`
            );
          }
        );
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
