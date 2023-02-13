import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { INCREASE_BONUS_FACTION } from "@providers/constants/SkillConstants";
import { EquipmentStatsCalculator } from "@providers/equipment/EquipmentStatsCalculator";
import { container } from "@providers/inversify/container";
import { provide } from "inversify-binding-decorators";

@provide(SkillStatsCalculator)
export class SkillStatsCalculator {
  /*
  skillsSchema.virtual("attack").get(async function (this: ISkill) {
  const skillStatsCalculator = container.get(SkillStatsCalculator);

  return await skillStatsCalculator.getTotalAttackOrDefense(this, true);
});

skillsSchema.virtual("magicAttack").get(async function (this: ISkill) {
  const skillStatsCalculator = container.get(SkillStatsCalculator);

  return await skillStatsCalculator.getTotalAttackOrDefense(this, true, true);
});

skillsSchema.virtual("defense").get(async function (this: ISkill) {
  const skillStatsCalculator = container.get(SkillStatsCalculator);

  return await skillStatsCalculator.getTotalAttackOrDefense(this, false);
});

skillsSchema.virtual("magicDefense").get(async function (this: ISkill) {
  const skillStatsCalculator = container.get(SkillStatsCalculator);

  return await skillStatsCalculator.getTotalAttackOrDefense(this, false, true);
});
  */

  public async getAttack(skill: ISkill): Promise<number> {
    return await this.getTotalAttackOrDefense(skill, true);
  }

  public async getMagicAttack(skill: ISkill): Promise<number> {
    return await this.getTotalAttackOrDefense(skill, true, true);
  }

  public async getDefense(skill: ISkill): Promise<number> {
    return await this.getTotalAttackOrDefense(skill, false);
  }

  public async getMagicDefense(skill: ISkill): Promise<number> {
    return await this.getTotalAttackOrDefense(skill, false, true);
  }

  private async getTotalAttackOrDefense(skill: ISkill, isAttack: boolean, isMagic: boolean = false): Promise<number> {
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
}
