import chalk from "chalk";
import { Schema, SchemaOptions } from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { MongooseQueryLogger } from "mongoose-query-logger";
import { QueryLoggerArgs } from "mongoose-query-logger/dist/types";
import { GetSchemaType, createSchema } from "ts-mongoose";
// create a wrapper function around createSchema, with mongooseLeanDefaults and mongooseLeanVirtuals and typings

import locks from "mongoose-locks";

export const queryLogger = new MongooseQueryLogger();
const warning = chalk.hex("#FFA500");
const critical = chalk.hex("#FF0000");

const customQueryLogger: (args: QueryLoggerArgs) => void = (args) => {
  if (args.executionTimeMS >= 500) {
    console.log(warning(`Warning: Query took more than 500ms: ${JSON.stringify(args, null, 2)}`));
  } else {
    if (args.executionTimeMS >= 1000) {
      console.log(critical(`Critical: Query took more than 1000ms: ${JSON.stringify(args, null, 2)}`));
    }
  }
};

queryLogger.setQueryLogger(customQueryLogger);

queryLogger.setExplain(false);

type SchemaDefinition = {
  [x: string]: any;
};

export function createLeanSchema<T extends SchemaDefinition, O extends SchemaOptions>(
  definition?: T,
  options?: O
): Schema & {
  definition: {
    [P in keyof GetSchemaType<O, T>]: GetSchemaType<O, T>[P];
  };
  options: O;
} {
  return createSchema(definition, options)
    .plugin(mongooseLeanDefaults)
    .plugin(mongooseLeanVirtuals)
    .plugin(queryLogger.getPlugin())
    .plugin(locks, { helpers: true, throw: true });
}
