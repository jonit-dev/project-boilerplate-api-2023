import { calculateSPToNextLevel, calculateXPToNextLevel } from "@providers/skill/SkillCalculator";
import { SkillType, TypeHelper } from "@rpg-engine/shared";
import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";
import { Equipment } from "./EquipmentModel";

const skillDetails = (type: SkillType): Record<string, any> => {
  return {
    type: Type.string({
      required: true,
      default: type,
      enum: TypeHelper.enumToStringArray(SkillType),
    }),
    level: Type.number({
      required: true,
      default: 1,
    }),
    skillPoints: Type.number({
      required: true,
      default: 0,
    }),
    skillPointsToNextLevel: Type.number({
      required: true,
      default: calculateSPToNextLevel(0, 2),
    }),
  };
};

export const skillsSchema = createSchema(
  {
    owner: Type.objectId({
      refPath: "ownerRef", // ownerRef can be a Character or NPC!
    }),
    ownerRef: Type.string({
      enum: ["Character", "NPC"],
    }),
    ownerType: Type.string({
      required: true,
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
    xpToNextLevel: Type.number({
      required: true,
      default: calculateXPToNextLevel(0, 2),
    }),

    // Basic attributes

    stamina: skillDetails(SkillType.BasicAttributes),
    magic: skillDetails(SkillType.BasicAttributes),
    magicResistance: skillDetails(SkillType.BasicAttributes),
    strength: skillDetails(SkillType.BasicAttributes),
    resistance: skillDetails(SkillType.BasicAttributes),
    dexterity: skillDetails(SkillType.BasicAttributes),

    // Combat skills

    first: skillDetails(SkillType.Combat),
    club: skillDetails(SkillType.Combat),
    sword: skillDetails(SkillType.Combat),
    axe: skillDetails(SkillType.Combat),
    distance: skillDetails(SkillType.Combat),
    shielding: skillDetails(SkillType.Combat),

    // Crafting/Gathering Skills

    fishing: skillDetails(SkillType.Gathering),
    mining: skillDetails(SkillType.Crafting),
    lumberjacking: skillDetails(SkillType.Crafting),
    cooking: skillDetails(SkillType.Crafting),
    alchemy: skillDetails(SkillType.Crafting),
    ...({} as {
      attack: Promise<number>;
      defense: Promise<number>;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

skillsSchema.virtual("attack").get(async function (this: ISkill) {
  if (this.ownerType === "Character") {
    const equipment = await Equipment.findOne({
      owner: this.owner,
    });

    if (equipment) {
      const totalEquippedAttack = await equipment?.totalEquippedAttack;

      return this.strength.level + this.level + totalEquippedAttack || 0;
    }
  }

  // for regular NPCs
  return this.strength.level + this.level;
});

skillsSchema.virtual("defense").get(async function (this: ISkill) {
  if (this.ownerType === "Character") {
    const equipment = await Equipment.findOne({
      owner: this.owner,
    });
    if (equipment) {
      const totalEquippedDefense = await equipment?.totalEquippedDefense;

      return this.resistance.level + this.level + totalEquippedDefense || 0;
    }
  }
  // for regular NPCs
  return this.resistance.level + this.level;
});

export type ISkill = ExtractDoc<typeof skillsSchema>;

export const Skill = typedModel("Skill", skillsSchema);
