import { TypeHelper } from "@providers/types/TypeHelper";
import { CharacterClass, CharacterGender } from "tempTypes/CharacterTypes";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const characterSchema = createSchema(
  {
    name: Type.string({
      required: true,
    }),
    owner: Type.objectId({
      ref: "User",
    }),
    health: Type.number({
      default: 100,
    }),
    mana: Type.number({
      default: 100,
    }),
    x: Type.number({
      default: 160,
    }),
    y: Type.number({
      default: 192,
    }),
    direction: Type.string({
      default: "down",
    }),
    class: Type.string({
      required: true,
      default: CharacterClass.None,
      enum: TypeHelper.enumToStringArray(CharacterClass),
    }),
    gender: Type.string({
      required: true,
      default: CharacterGender.Male,
      enum: TypeHelper.enumToStringArray(CharacterGender),
    }),
    totalWeightCapacity: Type.number({
      required: true,
      default: 100,
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type ICharacter = ExtractDoc<typeof characterSchema>;

export const Character = typedModel("Character", characterSchema);
