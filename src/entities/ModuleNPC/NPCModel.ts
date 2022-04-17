import {
  CharacterClass,
  CharacterGender,
  MapLayers,
  NPCAlignment,
  NPCMovementType,
  NPCPathOrientation,
  NPCTargetType,
  TypeHelper,
} from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const npcSchema = createSchema(
  {
    tiledId: Type.number({ required: true }),
    key: Type.string({
      required: true,
    }),
    textureKey: Type.string({
      required: true,
    }),
    health: Type.number({
      default: 100,
      required: true,
    }),
    mana: Type.number({
      default: 0,
      required: true,
    }),
    alignment: Type.string({
      required: true,
      default: NPCAlignment.Neutral,
      enum: TypeHelper.enumToStringArray(NPCAlignment),
    }),
    targetType: Type.string({
      required: true,
      default: NPCTargetType.Default,
      enum: TypeHelper.enumToStringArray(NPCTargetType),
    }),
    targetCharacter: Type.objectId({
      ref: "Character",
    }),
    name: Type.string({
      required: true,
    }),
    x: Type.number({
      required: true,
    }),
    y: Type.number({
      required: true,
    }),
    initialX: Type.number({
      required: true,
    }),
    initialY: Type.number({
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
    layer: Type.number({
      required: true,
      default: MapLayers.Character,
    }),

    originalMovementType: Type.string({
      required: true,
      enum: TypeHelper.enumToStringArray(NPCMovementType),
    }),

    currentMovementType: Type.string({
      required: true,
      default: NPCMovementType.Random,
      enum: TypeHelper.enumToStringArray(NPCMovementType),
    }),
    maxRangeInGridCells: Type.number(),
    pathOrientation: Type.string({
      enum: TypeHelper.enumToStringArray(NPCPathOrientation),
    }),
    fixedPath: {
      endGridX: Type.number(),
      endGridY: Type.number(),
    },
    pm2InstanceManager: Type.number({
      required: true,
    }),
    speed: Type.number({
      default: 2.5,
      required: true,
    }),
    dialogText: Type.string({
      required: true,
      default: "Hmm!?...",
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type INPC = ExtractDoc<typeof npcSchema>;

export const NPC = typedModel("NPC", npcSchema);
