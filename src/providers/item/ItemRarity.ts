import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemRarities } from "@rpg-engine/shared/dist/types/item.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(ItemRarity)
export class ItemRarity {
  constructor() {}

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

    const buffItemRarities = {
      [ItemRarities.Common]: 0,
      [ItemRarities.Uncommon]: 0.1,
      [ItemRarities.Rare]: 0.15,
      [ItemRarities.Epic]: 0.2,
      [ItemRarities.Legendary]: 0.25,
    };

    stats.attack
      ? (stats.attack = Math.ceil(stats.attack + stats.attack * buffItemRarities[stats.rarity]))
      : (stats.attack = 0);
    stats.defense
      ? (stats.defense = Math.ceil(stats.defense + stats.defense * buffItemRarities[stats.rarity]))
      : (stats.defense = 0);
    stats.rarity ? stats.rarity : (stats.rarity = ItemRarities.Common);

    rarityBuff = {
      attack: stats.attack,
      defense: stats.defense,
      rarity: stats.rarity,
    };

    return rarityBuff;
  }
}
