import { EnvType } from "@project-remote-job-board/shared/dist";
import cachegoose from "cachegoose";
import dayjs from "dayjs";
import mongoose from "mongoose";

import { appEnv } from "../config/env";
import { LONG_CACHE_DURATION } from "../constants/CacheConstants";
import { DEFAULT_DATE_FORMAT } from "../constants/DateConstants";
import { MONGO_CONNECTION_STRING } from "../constants/MongoConstants";

export class MongoDBHelper {
  public static async init(): Promise<void> {
    try {
      await mongoose.connect(
        MONGO_CONNECTION_STRING,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          dbName: process.env.MONGO_INITDB_DATABASE,
        },
        (err) => {
          if (err) {
            console.log("Error while connecting to MongoDB!");
            console.log(err);
            return;
          }

          console.log(
            `Connected to mongodb database on Docker container ${appEnv.database.MONGO_HOST_CONTAINER} at port ${appEnv.database.MONGO_PORT}`
          );
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Filter a range of dates
   * @param from YYYY-MM-DD
   * @param to YYYY-MM-DD
   * @returns
   */
  public static async findByDateRange<T>(Model, query, from: string, to: string, sort?: string): Promise<T> {
    cachegoose(mongoose);
    const fromFormatted = dayjs(from).format(DEFAULT_DATE_FORMAT);
    const toFormatted = dayjs(to).add(1, "day").format(DEFAULT_DATE_FORMAT);

    switch (appEnv.general.ENV) {
      case EnvType.Development:
        const results = await Model.find({
          ...query,
          date: {
            $gte: new Date(fromFormatted),
            $lt: new Date(toFormatted),
          },
          // 82800 seconds = 23 hours
        })
          .sort({ date: sort })
          .lean();
        return results;

      case EnvType.Production:
        const cachedResults = await Model.find({
          ...query,
          date: {
            $gte: new Date(fromFormatted),
            $lt: new Date(toFormatted),
          },
          // 82800 seconds = 23 hours
        })
          .cache(LONG_CACHE_DURATION, JSON.stringify(query))
          .sort({ date: sort })
          .lean();

        return cachedResults;

      default:
        return results;
    }
  }
}
