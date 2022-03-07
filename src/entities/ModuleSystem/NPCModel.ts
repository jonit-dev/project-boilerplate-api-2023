import { TypeHelper } from "@providers/types/TypeHelper";
import { CharacterClass, CharacterGender, MapLayers } from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const npcSchema = createSchema(
  {
    name: Type.string({
      required: true,
    }),
    x: Type.number({
      required: true,
    }),
    y: Type.number({
      required: true,
    }),
    direction: Type.string({
      required: true,
      default: "down",
    }),
    scene: Type.string({
      required: true,
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
    texture: Type.string({
      required: true,
    }),
    layer: Type.number({
      required: true,
      default: MapLayers.Player,
    }),
    key: Type.string({
      required: true,
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type INPC = ExtractDoc<typeof npcSchema>;

export const NPC = typedModel("NPC", npcSchema);
