import { Schema, SchemaOptions } from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { GetSchemaType, createSchema } from "ts-mongoose";
// create a wrapper function around createSchema, with mongooseLeanDefaults and mongooseLeanVirtuals and typings

import locks from "mongoose-locks";

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
    .plugin(locks, { helpers: true, throw: true });
}
