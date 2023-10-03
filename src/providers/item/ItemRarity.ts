import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { blueprintManager } from "@providers/inversify/container";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { CraftingSkill } from "@rpg-engine/shared";
import { IConsumableItemBlueprint, ItemRarities } from "@rpg-engine/shared/dist/types/item.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";
import { AvailableBlueprints } from "./data/types/itemsBlueprintTypes";
import { recoveryPowerLevels } from "./data/usableEffects/FoodUsableEffect/EatingUsableEffect";

type FoodBuffStats = {
  healthRecovery: number;
  rarity: ItemRarities;
  usableEffectDescription: string;
};

type InputStats = {
  healthRecovery: number | undefined;
  rarity: ItemRarities;
};

@provide(ItemRarity)
export class ItemRarity {
  constructor(private traitGetter: TraitGetter) {}

  private readonly buffItemRarities = {
    [ItemRarities.Common]: 0,
    [ItemRarities.Uncommon]: 0.1,
    [ItemRarities.Rare]: 0.15,
    [ItemRarities.Epic]: 0.2,
    [ItemRarities.Legendary]: 0.25,
  };

  private readonly buffItemRaritiesLowStatus = {
    [ItemRarities.Common]: 0,
    [ItemRarities.Uncommon]: 1,
    [ItemRarities.Rare]: 3,
    [ItemRarities.Epic]: 4,
    [ItemRarities.Legendary]: 6,
  };

  public setItemRarityOnLootDrop(item: IItem): { attack: number; defense: number; rarity: ItemRarities } {
    let rarity = this.randomizeRarity();

    if (!item.rarity) {
      rarity = ItemRarities.Common;
    }

    const stats = { attack: item.attack, defense: item.defense, rarity: rarity };
    const rarityAttackDefense = this.randomizeRarityBuff(stats);

    return rarityAttackDefense;
  }

  @TrackNewRelicTransaction()
  public async setItemRarityOnLootDropForFood(
    item: IItem
  ): Promise<{ healthRecovery: number; rarity: ItemRarities; usableEffectDescription: string } | undefined> {
    // Check if the item is valid
    if (!item) {
      throw new Error("Invalid item passed");
    }
    const rarity = item.rarity ? this.randomizeRarity() : ItemRarities.Common;

    let bluePrintItem: IConsumableItemBlueprint | undefined;

    // Wrap in try-catch for error handling
    try {
      bluePrintItem = await blueprintManager.getBlueprint<IConsumableItemBlueprint>(
        "items",
        item.key as AvailableBlueprints
      );
    } catch (error) {
      console.error(`Failed to get blueprint: ${error}`);
      return undefined;
    }

    if (!bluePrintItem?.usableEffect) {
      return undefined;
    }

    // Ensure recoveryPowerLevels contains the key
    if (!Object.prototype.hasOwnProperty.call(recoveryPowerLevels, bluePrintItem.usableEffectKey)) {
      console.error(`Invalid key: ${bluePrintItem.usableEffectKey}`);
      return undefined;
    }

    const recoveryValue = recoveryPowerLevels[bluePrintItem.usableEffectKey];
    const rarityRecovery = this.randomizeRarityBuffForFood({
      healthRecovery: recoveryValue,
      rarity,
    });

    return rarityRecovery;
  }

  private randomizeRarityBuffForFood(stats: InputStats): FoodBuffStats {
    const DEFAULT_RARITY = ItemRarities.Common;
    const DEFAULT_HEALTH_RECOVERY = 0;
    const MAX_TIMES_EFFECT_APPLIES = 5;

    let multi = 1;
    if (stats.healthRecovery && stats.healthRecovery < 0) {
      multi = -1;
      stats.healthRecovery = stats.healthRecovery * multi;
    }

    const rarity = stats.rarity ? stats.rarity : DEFAULT_RARITY;
    const healthRecovery = stats.healthRecovery
      ? this.getItemRarityBuffStats(stats.healthRecovery, rarity)
      : DEFAULT_HEALTH_RECOVERY;

    const rarityBuff: FoodBuffStats = {
      healthRecovery: healthRecovery * multi,
      rarity: rarity,
      usableEffectDescription: `Restores ${healthRecovery * multi} HP and Mana ${MAX_TIMES_EFFECT_APPLIES} times`,
    };

    return rarityBuff;
  }

  public async setItemRarityOnCraft(
    character: ICharacter,
    item: IItem,
    skillId: Types.ObjectId
  ): Promise<{ attack: number; defense: number; rarity: ItemRarities }> {
    const skills = (await Skill.findById(skillId)
      .lean()
      .cacheQuery({
        cacheKey: `${character?._id}-skills`,
      })) as unknown as ISkill;

    if (!skills) {
      return { attack: 0, defense: 0, rarity: ItemRarities.Common };
    }

    const blacksmithingLevel = await this.traitGetter.getSkillLevelWithBuffs(
      skills as ISkill,
      CraftingSkill.Blacksmithing
    );

    const proficiency = blacksmithingLevel / 10;

    let rarity = this.randomizeRarity(true, proficiency);
    if (!item.rarity) {
      rarity = ItemRarities.Common;
    }

    const stats = { attack: item.attack, defense: item.defense, rarity: rarity };
    const rarityAttackDefense = this.randomizeRarityBuff(stats);

    return rarityAttackDefense;
  }

  public async setItemRarityOnFoodCraft(
    character: ICharacter,
    item: IItem,
    skillId: Types.ObjectId
  ): Promise<{ healthRecovery: number; rarity: ItemRarities; usableEffectDescription: string }> {
    let skills: ISkill | null = null;
    try {
      skills = (await Skill.findById(skillId)
        .lean()
        .cacheQuery({
          cacheKey: `${character?._id}-skills`,
        })) as ISkill | null;
    } catch (error) {
      console.error("Error retrieving skill by id: ", error);
    }

    let bluePrintItem: IConsumableItemBlueprint | null = null;
    try {
      bluePrintItem = await blueprintManager.getBlueprint<IConsumableItemBlueprint>(
        "items",
        item.key as AvailableBlueprints
      );
    } catch (error) {
      console.error("Error retrieving blueprint: ", error);
    }

    if (!bluePrintItem || !bluePrintItem.usableEffect) {
      return {
        healthRecovery: 0,
        rarity: ItemRarities.Common,
        usableEffectDescription: "Restores 0 HP and Mana 5 times",
      };
    }

    const healthRecovery = recoveryPowerLevels[bluePrintItem.usableEffectKey];

    if (!skills) {
      return {
        healthRecovery,
        rarity: ItemRarities.Common,
        usableEffectDescription: bluePrintItem.usableEffectDescription || "",
      };
    }

    const COOKING_PROFICIENCY_DIVISOR = 10;
    const cookingLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, CraftingSkill.Cooking);
    const proficiency = cookingLevel / COOKING_PROFICIENCY_DIVISOR;

    let rarity = this.randomizeRarity(true, proficiency);
    if (!item.rarity) {
      rarity = ItemRarities.Common;
    }

    return this.randomizeRarityBuffForFood({ healthRecovery, rarity });
  }

  private randomizeRarity(isCraft?: boolean, proficiency?: number): ItemRarities {
    let variable = 0;
    if (isCraft && proficiency) {
      proficiency > 0 ? (variable = proficiency) : (variable = 0);
    }

    const rarity = _.random(variable, 100, true);

    const commonRarityLimit = Math.max(90 - (proficiency ?? 0), 0);
    const uncommonRarityLimit = Math.max(98 - (proficiency ?? 0), 0);
    const rareRarityLimit = Math.max(99 - (proficiency ?? 0) * 0.1, 0);
    const epicRarityLimit = Math.max(99.75 - (proficiency ?? 0) * 0.05, 0);

    switch (true) {
      case rarity <= commonRarityLimit:
        return ItemRarities.Common;
      case rarity <= uncommonRarityLimit:
        return ItemRarities.Uncommon;
      case rarity <= rareRarityLimit:
        return ItemRarities.Rare;
      case rarity <= epicRarityLimit:
        return ItemRarities.Epic;
      case rarity <= 100:
        return ItemRarities.Legendary;
      default:
        return ItemRarities.Common;
    }
  }

  private randomizeRarityBuff(stats: {
    attack: number | undefined;
    defense: number | undefined;
    rarity: ItemRarities;
  }): { attack: number; defense: number; rarity: ItemRarities } {
    let rarityBuff = { attack: 0, defense: 0, rarity: ItemRarities.Common };

    stats.rarity ? stats.rarity : (stats.rarity = ItemRarities.Common);
    stats.attack ? (stats.attack = this.getItemRarityBuffStats(stats.attack, stats.rarity)) : (stats.attack = 0);
    stats.defense ? (stats.defense = this.getItemRarityBuffStats(stats.defense, stats.rarity)) : (stats.defense = 0);

    rarityBuff = {
      attack: stats.attack,
      defense: stats.defense,
      rarity: stats.rarity,
    };

    return rarityBuff;
  }

  private getItemRarityBuffStats(defaultValue: number | 0, rarity: ItemRarities): number {
    let buffedValue = 0;
    if (defaultValue >= 15) {
      buffedValue = Math.ceil(defaultValue + defaultValue * this.buffItemRarities[rarity]);
    } else {
      buffedValue = Math.ceil(defaultValue + this.buffItemRaritiesLowStatus[rarity]);
    }
    return buffedValue;
  }
}
