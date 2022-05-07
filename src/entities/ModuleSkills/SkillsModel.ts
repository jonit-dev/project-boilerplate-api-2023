import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const skillsSchema = createSchema(
  {
    owner: Type.objectId({
      refPath: "ownerRef", // ownerRef can be a Character or NPC!
      required: true,
    }),
    ownerRef: Type.string({
      enum: ["Character", "NPC"],
    }),
    level: Type.number({
      required: true,
      default: 1,
    }),
    xpGainRate: Type.number({
      required: true,
      default: 100,
    }),
    experience: Type.number({
      required: true,
      default: 0,
    }),
    stamina: Type.number({
      required: true,
      default: 0,
    }),
    magic: Type.number({
      required: true,
      default: 0,
    }),
    strength: Type.number({
      required: true,
      default: 0,
    }),
    dexterity: Type.number({
      required: true,
      default: 0,
    }),
    first: Type.number({
      required: true,
      default: 0,
    }),
    club: Type.number({
      required: true,
      default: 0,
    }),
    sword: Type.number({
      required: true,
      default: 0,
    }),
    axe: Type.number({
      required: true,
      default: 0,
    }),
    distance: Type.number({
      required: true,
      default: 0,
    }),
    shielding: Type.number({
      required: true,
      default: 0,
    }),
    fishing: Type.number({
      required: true,
      default: 0,
    }),
    mining: Type.number({
      required: true,
      default: 0,
    }),
    lumberjacking: Type.number({
      required: true,
      default: 0,
    }),
    cooking: Type.number({
      required: true,
      default: 0,
    }),
    alchemy: Type.number({
      required: true,
      default: 0,
    }),
    magicResistance: Type.number({
      required: true,
      default: 0,
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type ISkill = ExtractDoc<typeof skillsSchema>;

export const Skill = typedModel("Skill", skillsSchema);
