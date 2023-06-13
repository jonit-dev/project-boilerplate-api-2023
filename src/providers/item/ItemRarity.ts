import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { CraftingSkill } from "@rpg-engine/shared";
import { ItemRarities } from "@rpg-engine/shared/dist/types/item.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";

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
