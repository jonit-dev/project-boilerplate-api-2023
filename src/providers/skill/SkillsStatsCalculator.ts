import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import {
  DAMAGE_ATTRIBUTE_WEIGHT,
  DAMAGE_COMBAT_SKILL_WEIGHT,
  INCREASE_BONUS_FACTION,
} from "@providers/constants/SkillConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EquipmentStatsCalculator } from "@providers/equipment/EquipmentStatsCalculator";
import { container } from "@providers/inversify/container";
import { BasicAttribute } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { capitalize } from "lodash";
import { SkillsAvailable } from "./SkillTypes";
import { TraitGetter } from "./TraitGetter";

@provide(SkillStatsCalculator)
export class SkillStatsCalculator {
  constructor(
    private inMemoryHashTable: InMemoryHashTable,
    private traitGetter: TraitGetter,
    private characterWeapon: CharacterWeapon
  ) {}

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
    if (!skills.owner) return 0;

    const ownerType = skills.owner.toString();

    if (skills.ownerType === "Character") {
      const cachedValue = await this.getCachedAttackOrDefense(ownerType, isAttack);
      if (cachedValue) return cachedValue;
    }

    const [equipment, dataOfWeather, character] = await Promise.all([
      this.getEquipment(ownerType),
      MapControlTimeModel.findOne().lean(),
      Character.findById(skills.owner).lean() as unknown as ICharacter,
    ]);

    if (skills.ownerType === "Character" && equipment) {
      return await this.calculateCharacterTotal(skills, isAttack, isMagic, equipment, dataOfWeather, character);
    }

    // For regular NPCs
    return isAttack ? skills.strength.level + skills.level : skills.resistance.level + skills.level;
  }

  private async getCachedAttackOrDefense(ownerType: string, isAttack: boolean): Promise<number | null> {
    const attackOrDefense = isAttack ? "attack" : "defense";
    const cachedValue = await this.inMemoryHashTable.get(ownerType, `total${capitalize(attackOrDefense)}`);
    return cachedValue ? cachedValue[attackOrDefense] : null;
  }

  private async getEquipment(owner: string): Promise<IEquipment> {
    return (await Equipment.findOne({ owner })
      .lean({ virtuals: true, defaults: true })
      .cacheQuery({ cacheKey: `${owner}-equipment` })) as unknown as IEquipment;
  }

  private async calculateCharacterTotal(
    skills: ISkill,
    isAttack: boolean,
    isMagic: boolean,
    equipment: IEquipment,
    dataOfWeather,
    character: ICharacter
  ): Promise<number> {
    const equipmentStatsCalculator = container.get<EquipmentStatsCalculator>(EquipmentStatsCalculator);
    const totalEquipped = await equipmentStatsCalculator.getTotalEquipmentStats(
      equipment._id,
      isAttack ? "attack" : "defense"
    );

    const baseValue = await this.getBaseValue(character, skills, isAttack, isMagic);
    const totalValueNoBonus = baseValue + skills.level + totalEquipped;
    const totalValueWithBonus = totalValueNoBonus + totalValueNoBonus * INCREASE_BONUS_FACTION;

    if (this.hasWeatherBonus(character, dataOfWeather)) {
      await this.updateValuesRedis(isAttack, skills.owner!.toString(), totalValueWithBonus);
      return totalValueWithBonus;
    }

    await this.updateValuesRedis(isAttack, skills.owner!.toString(), totalValueNoBonus);
    return totalValueNoBonus;
  }

  private async getBaseValue(
    character: ICharacter,
    skills: ISkill,
    isAttack: boolean,
    isMagic: boolean
  ): Promise<number> {
    const basicAttribute = this.getAttribute(isAttack, isMagic);
    const basicAttributeLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, basicAttribute);

    const combatSkill = await this.characterWeapon.getSkillNameByWeapon(character);

    let combatSkillLevel = 0;

    if (combatSkill) {
      combatSkillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, combatSkill as SkillsAvailable);
    }

    return basicAttributeLevel * DAMAGE_ATTRIBUTE_WEIGHT + combatSkillLevel * DAMAGE_COMBAT_SKILL_WEIGHT;
  }

  private getAttribute(isAttack: boolean, isMagic: boolean): BasicAttribute {
    if (isAttack && !isMagic) return BasicAttribute.Strength;
    if (!isAttack && !isMagic) return BasicAttribute.Resistance;
    if (isAttack && isMagic) return BasicAttribute.Magic;
    return BasicAttribute.MagicResistance;
  }

  private hasWeatherBonus(character: ICharacter, dataOfWeather): boolean {
    return (
      (character?.faction === "Life Bringer" && dataOfWeather?.period === "Morning") ||
      (character?.faction === "Shadow Walker" && dataOfWeather?.period === "Night")
    );
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
