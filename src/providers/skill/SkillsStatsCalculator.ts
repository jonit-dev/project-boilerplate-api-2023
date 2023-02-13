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
  public async getTotalAttackOrDefense(skill: ISkill, isAttack: boolean, isMagic: boolean = false): Promise<void> {
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
