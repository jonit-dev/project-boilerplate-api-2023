import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { INCREASE_BONUS_FACTION } from "@providers/constants/SkillConstants";
import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { EquipmentStatsCalculator } from "@providers/equipment/EquipmentStatsCalculator";
import { container } from "@providers/inversify/container";
import { calculateExperience } from "@providers/npc/NPCExperience";
import {
  NPCAlignment,
  SkillType,
  TypeHelper,
  calculateSPToNextLevel,
  calculateXPToNextLevel,
} from "@rpg-engine/shared";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
import { Character } from "./CharacterModel";
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
    lastSkillGain: Type.date({
      required: true,
      default: new Date(),
    }),
  };
};

export const skillsSchema = createLeanSchema(
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
    dagger: skillDetails(SkillType.Combat),

    // Crafting/Gathering Skills

    fishing: skillDetails(SkillType.Gathering),
    mining: skillDetails(SkillType.Crafting),
    lumberjacking: skillDetails(SkillType.Crafting),
    cooking: skillDetails(SkillType.Crafting),
    alchemy: skillDetails(SkillType.Crafting),
    blacksmithing: skillDetails(SkillType.Crafting),
    ...({} as {
      attack: Promise<number>;
      defense: Promise<number>;
      magicAttack: Promise<number>;
      magicDefense: Promise<number>;
    }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

skillsSchema.post("save", async function (this: ISkill) {
  const npc = (await NPC.findById(this.owner)) as INPC;

  if (!npc || npc?.experience) {
    return;
  }

  if (npc?.alignment === NPCAlignment.Hostile || npc?.alignment === NPCAlignment.Neutral) {
    const skills = (await Skill.findById(this._id).lean({ virtuals: true, default: true })) as ISkill;
    const experience = calculateExperience(npc.baseHealth, skills);

    await NPC.updateOne(
      {
        _id: npc._id,
      },
      {
        experience,
      }
    );
  }
});

async function getTotalAttackOrDefense(skill: ISkill, isAttack: boolean, isMagic: boolean = false): Promise<void> {
  const equipment = await Equipment.findOne({ owner: skill.owner }).lean();
  const [dataOfWeather, character] = await Promise.all([
    MapControlTimeModel.findOne().lean(),
    Character.findById(skill.owner).lean(),
  ]);

  if (skill.ownerType === "Character" && equipment) {
    const equipmentStatsCalculator = container.get<EquipmentStatsCalculator>(EquipmentStatsCalculator);

    const totalEquippedAttack = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");
    const totalEquippedDefense = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "defense");
    const totalEquipped = isMagic ? 0 : isAttack ? totalEquippedAttack : totalEquippedDefense;
    const baseValue =
      isAttack && !isMagic
        ? skill.strength.level
        : !isAttack && !isMagic
        ? skill.resistance.level
        : isAttack && isMagic
        ? skill.magic.level
        : skill.magicResistance.level;
    const totalValueNoBonus = baseValue + skill.level + totalEquipped;
    const totalValueWithBonus = totalValueNoBonus + totalValueNoBonus * INCREASE_BONUS_FACTION;

    if (character?.faction === "Life Bringer" && dataOfWeather?.period === "Morning") {
      return totalValueWithBonus || 0;
    }

    if (character?.faction === "Shadow Walker" && dataOfWeather?.period === "Night") {
      return totalValueWithBonus || 0;
    }

    return totalValueNoBonus || 0;
  }

  // for regular NPCs
  return isAttack ? skill.strength.level + skill.level : skill.resistance.level + skill.level;
}

skillsSchema.virtual("attack").get(async function (this: ISkill) {
  return await getTotalAttackOrDefense(this, true);
});

skillsSchema.virtual("magicAttack").get(async function (this: ISkill) {
  return await getTotalAttackOrDefense(this, true, true);
});

skillsSchema.virtual("defense").get(async function (this: ISkill) {
  return await getTotalAttackOrDefense(this, false);
});

skillsSchema.virtual("magicDefense").get(async function (this: ISkill) {
  return await getTotalAttackOrDefense(this, false, true);
});

export type ISkill = ExtractDoc<typeof skillsSchema>;

export const Skill = typedModel("Skill", skillsSchema);
