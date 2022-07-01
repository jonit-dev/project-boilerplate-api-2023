import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { createLeanSchema } from "@providers/database/mongooseHelpers";
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
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const npcSchema = createLeanSchema(
  {
    name: Type.string({
      required: true,
    }),
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
    maxHealth: Type.number({
      default: 100,
      required: true,
    }),
    mana: Type.number({
      default: 0,
      required: true,
    }),
    maxMana: Type.number({
      default: 100,
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
    attackType: Type.string({
      required: true,
      enum: TypeHelper.enumToStringArray(EntityAttackType),
      default: EntityAttackType.Melee,
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
    maxRangedDistanceInGridCells: Type.number(),
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
      default: 1.5,
      required: true,
    }),
    dialogText: Type.string(),
    skills: Type.objectId({
      ref: "Skill",
      required: true,
    }),
    spawnIntervalMin: Type.number({
      required: true,
      default: 1,
    }),
    nextSpawnTime: Type.date(),
    fleeOnLowHealth: Type.boolean({
      default: false,
      required: true,
    }),
    ...({} as {
      isAlive: boolean;
      type: string;
    }),
    xpPerDamage: Type.number({
      required: false,
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type INPC = ExtractDoc<typeof npcSchema>;

npcSchema.virtual("isAlive").get(function (this: INPC) {
  return this.health > 0;
});

npcSchema.virtual("type").get(function (this: INPC) {
  return "NPC";
});

npcSchema.post("remove", async function (this: INPC) {
  // remove associated skill model

  const skill = await Skill.findOne({ _id: this.skills });

  if (skill) {
    await skill.remove();
  }
});

export const NPC = typedModel("NPC", npcSchema);
