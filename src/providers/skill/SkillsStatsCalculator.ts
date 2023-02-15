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
    const equipment = await Equipment.findOne({ owner: skill.owner }).lean({ virtuals: true, default: true });
    const [dataOfWeather, character] = await Promise.all([
      MapControlTimeModel.findOne().lean(),
      Character.findById(skill.owner).lean(),
    ]);

    if (skill.ownerType === "Character" && equipment) {
      const equipmentStatsCalculator = container.get<EquipmentStatsCalculator>(EquipmentStatsCalculator);

      const totalEquippedAttack = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");
      const totalEquippedDefense = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "defense");

      const totalEquipped = isAttack ? totalEquippedAttack : totalEquippedDefense;
      let baseValue = 0;
      switch (true) {
        case isAttack && !isMagic:
          baseValue = skill.strength.level;
          break;
        case !isAttack && !isMagic:
          baseValue = skill.resistance.level;
          break;
        case isAttack && isMagic:
          baseValue = skill.magic.level;
          break;
        case !isAttack && isMagic:
          baseValue = skill.magicResistance.level;
          break;
        default:
          break;
      }

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
