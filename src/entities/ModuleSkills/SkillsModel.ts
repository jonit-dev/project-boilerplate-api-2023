import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

export const skillsSchema = createSchema(
  {
    owner: Type.objectId({
      refPath: "ownerRef", // ownerRef can be a Character or NPC!
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
      default: 1,
    }),
    magic: Type.number({
      required: true,
      default: 1,
    }),
    strength: Type.number({
      required: true,
      default: 1,
    }),
    resistance: Type.number({
      required: true,
      default: 1,
    }),
    dexterity: Type.number({
      required: true,
      default: 1,
    }),
    first: Type.number({
      required: true,
      default: 1,
    }),
    club: Type.number({
      required: true,
      default: 1,
    }),
    sword: Type.number({
      required: true,
      default: 1,
    }),
    axe: Type.number({
      required: true,
      default: 1,
    }),
    distance: Type.number({
      required: true,
      default: 1,
    }),
    shielding: Type.number({
      required: true,
      default: 1,
    }),
    fishing: Type.number({
      required: true,
      default: 1,
    }),
    mining: Type.number({
      required: true,
      default: 1,
    }),
    lumberjacking: Type.number({
      required: true,
      default: 1,
    }),
    cooking: Type.number({
      required: true,
      default: 1,
    }),
    alchemy: Type.number({
      required: true,
      default: 1,
    }),
    magicResistance: Type.number({
      required: true,
      default: 1,
    }),
    ...({} as {
      attack: number;
      defense: number;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

//! TODO: This should take into consideration the skill involving the weapon that's being used by the character!
skillsSchema.virtual("attack").get(function (this: ISkill) {
  return this.strength * this.level;
});

skillsSchema.virtual("defense").get(function (this: ISkill) {
  return this.resistance * this.level;
});

export type ISkill = ExtractDoc<typeof skillsSchema>;

export const Skill = typedModel("Skill", skillsSchema);
