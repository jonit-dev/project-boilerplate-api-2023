import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { INCREASE_BONUS_FACTION } from "@providers/constants/SkillConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EquipmentStatsCalculator } from "@providers/equipment/EquipmentStatsCalculator";
import { container } from "@providers/inversify/container";
import { provide } from "inversify-binding-decorators";

@provide(SkillStatsCalculator)
export class SkillStatsCalculator {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

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
    if (!skill.owner) {
      return 0;
    }

    const redisAttack = await this.inMemoryHashTable.get(skill.owner.toString(), "totalAttack");
    const redisDefense = await this.inMemoryHashTable.get(skill.owner.toString(), "totalDefense");

    if (redisAttack && isAttack && skill.ownerType === "Character") {
      return redisAttack.attack;
    } else if (redisDefense && isAttack === false && skill.ownerType === "Character") {
      return redisDefense.defense;
    }

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
        await this.updateValuesRedis(isAttack, skill.owner.toString(), totalValueWithBonus);

        return totalValueWithBonus || 0;
      }

      if (character?.faction === "Shadow Walker" && dataOfWeather?.period === "Night") {
        await this.updateValuesRedis(isAttack, skill.owner.toString(), totalValueWithBonus);
        return totalValueWithBonus || 0;
      }

      await this.updateValuesRedis(isAttack, skill.owner.toString(), totalValueNoBonus);
      return totalValueNoBonus || 0;
    }

    // for regular NPCs
    return isAttack ? skill.strength.level + skill.level : skill.resistance.level + skill.level;
  }

  private async updateValuesRedis(isAttack: boolean, ownerSkill: string, value: number): Promise<void> {
    if (isAttack) {
      await this.inMemoryHashTable.set(ownerSkill, "totalAttack", {
        attack: value,
      });
    } else {
      await this.inMemoryHashTable.set(ownerSkill, "totalDefense", {
        defense: value,
      });
    }

    await this.inMemoryHashTable.expire(ownerSkill, 180, "NX");
  }
}
