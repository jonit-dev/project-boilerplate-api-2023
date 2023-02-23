import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemRarities } from "@rpg-engine/shared/dist/types/item.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(ItemRarity)
export class ItemRarity {
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

  public setItemRarity(item: IItem): { attack: number; defense: number; rarity: ItemRarities } {
    let rarity = this.randomizeRarity();

    if (!item.rarity) rarity = ItemRarities.Common;

    const stats = { attack: item.attack, defense: item.defense, rarity: rarity };
    const rarityAttackDefense = this.randomizeRarityBuff(stats);

    return rarityAttackDefense;
  }

  private randomizeRarity(): ItemRarities {
    const rarity = _.random(0, 100, true);
    switch (true) {
      case rarity <= 90:
        return ItemRarities.Common;
      case rarity <= 98:
        return ItemRarities.Uncommon;
      case rarity <= 99:
        return ItemRarities.Rare;
      case rarity <= 99.75:
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

  private getItemRarityBuffStats(defaultValue: number | 0, rarity: ItemRarities) {
    let buffedValue = 0;
    if (defaultValue >= 15) {
      buffedValue = Math.ceil(defaultValue + defaultValue * this.buffItemRarities[rarity]);
    } else {
      buffedValue = Math.ceil(defaultValue + this.buffItemRaritiesLowStatus[rarity]);
    }
    return buffedValue;
  }
}
