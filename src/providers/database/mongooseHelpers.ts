import { Schema, SchemaOptions } from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { createSchema, GetSchemaType } from "ts-mongoose";

// create a wrapper function around createSchema, with mongooseLeanDefaults and mongooseLeanVirtuals and typings

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
  return createSchema(definition, options).plugin(mongooseLeanDefaults).plugin(mongooseLeanVirtuals);
}
