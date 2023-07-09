import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { INCREASE_BONUS_FACTION } from "@providers/constants/SkillConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EquipmentStatsCalculator } from "@providers/equipment/EquipmentStatsCalculator";
import { container } from "@providers/inversify/container";
import { BasicAttribute } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { TraitGetter } from "./TraitGetter";

@provide(SkillStatsCalculator)
export class SkillStatsCalculator {
  constructor(private inMemoryHashTable: InMemoryHashTable, private traitGetter: TraitGetter) {}

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

  private async getTotalAttackOrDefense(skills: ISkill, isAttack: boolean, isMagic: boolean = false): Promise<number> {
    if (!skills.owner) {
      return 0;
    }

    const redisAttack = await this.inMemoryHashTable.get(skills.owner.toString(), "totalAttack");
    const redisDefense = await this.inMemoryHashTable.get(skills.owner.toString(), "totalDefense");

    if (redisAttack && isAttack && skills.ownerType === "Character") {
      return redisAttack.attack;
    } else if (redisDefense && isAttack === false && skills.ownerType === "Character") {
      return redisDefense.defense;
    }

    const equipment = await Equipment.findOne({ owner: skills.owner })
      .lean({ virtuals: true, defaults: true })
      .cacheQuery({
        cacheKey: `${skills.owner}-equipment`,
      });
    const [dataOfWeather, character] = await Promise.all([
      MapControlTimeModel.findOne().lean(),
      Character.findById(skills.owner).lean(),
    ]);

    if (skills.ownerType === "Character" && equipment) {
      const equipmentStatsCalculator = container.get<EquipmentStatsCalculator>(EquipmentStatsCalculator);

      const totalEquippedAttack = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "attack");
      const totalEquippedDefense = await equipmentStatsCalculator.getTotalEquipmentStats(equipment._id, "defense");

      const totalEquipped = isAttack ? totalEquippedAttack : totalEquippedDefense;
      let baseValue = 0;
      switch (true) {
        case isAttack && !isMagic:
          const strengthLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, BasicAttribute.Strength);

          baseValue = strengthLevel;
          break;
        case !isAttack && !isMagic:
          const resistanceLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, BasicAttribute.Resistance);

          baseValue = resistanceLevel;
          break;
        case isAttack && isMagic:
          const magicLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, BasicAttribute.Magic);

          baseValue = magicLevel;
          break;
        case !isAttack && isMagic:
          const magicResistanceLevel = await this.traitGetter.getSkillLevelWithBuffs(
            skills,
            BasicAttribute.MagicResistance
          );

          baseValue = magicResistanceLevel;
          break;
        default:
          break;
      }

      const totalValueNoBonus = baseValue + skills.level + totalEquipped;
      const totalValueWithBonus = totalValueNoBonus + totalValueNoBonus * INCREASE_BONUS_FACTION;

      if (character?.faction === "Life Bringer" && dataOfWeather?.period === "Morning") {
        await this.updateValuesRedis(isAttack, skills.owner.toString(), totalValueWithBonus);

        return totalValueWithBonus || 0;
      }

      if (character?.faction === "Shadow Walker" && dataOfWeather?.period === "Night") {
        await this.updateValuesRedis(isAttack, skills.owner.toString(), totalValueWithBonus);
        return totalValueWithBonus || 0;
      }

      await this.updateValuesRedis(isAttack, skills.owner.toString(), totalValueNoBonus);
      return totalValueNoBonus || 0;
    }

    // for regular NPCs
    // remember that for NPCs we dont calculate buffs yet
    return isAttack ? skills.strength.level + skills.level : skills.resistance.level + skills.level;
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
