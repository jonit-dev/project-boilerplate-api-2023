import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  LOOT_CRAFTING_MATERIAL_DROP_CHANCE,
  LOOT_FOOD_DROP_CHANCE,
  LOOT_GOLD_DROP_CHANCE,
  NPC_LOOT_CHANCE_MULTIPLIER,
} from "@providers/constants/LootConstants";
import { NPC_GIANT_FORM_LOOT_MULTIPLIER } from "@providers/constants/NPCConstants";
import { blueprintManager } from "@providers/inversify/container";
import { ItemRarity } from "@providers/item/ItemRarity";
import { AvailableBlueprints, OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { INPCLoot, ItemSubType, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { random, round } from "lodash";
import { calculateGold } from "./NPCGold";

@provide(NPCLoot)
export class NPCLoot {
  constructor(private itemRarity: ItemRarity) {}

  public getGoldLoot(npc: INPC): INPCLoot {
    if (!npc.skills) {
      throw new Error(`Error while calculating gold loot for NPC with key ${npc.key}: NPC has no skills.`);
    }

    const calculatedGold = calculateGold(npc.maxHealth, npc?.skills as unknown as Partial<ISkill>);
    const randomPercentage = (): number => random(70, 100) / 100;
    const goldLoot: INPCLoot = {
      chance: LOOT_GOLD_DROP_CHANCE * 100,
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      quantityRange: [1 + Math.floor(randomPercentage() * calculatedGold), Math.floor(calculatedGold)],
    };

    return goldLoot;
  }

  public async addLootToNPCBody(npcBody: IItem, loots: INPCLoot[], wasNpcInGiantForm?: boolean): Promise<void> {
    const itemContainer = await this.fetchItemContainer(npcBody);
    let isDeadBodyLootable = false;

    const bulkOps: any[] = [];

    for (const loot of loots) {
      const rand = round(random(0, 100, true), 2);
      const lootChance = round(
        await this.calculateLootChance(loot, wasNpcInGiantForm ? NPC_GIANT_FORM_LOOT_MULTIPLIER : 1),
        2
      );

      if (rand <= lootChance) {
        const lootQuantity = this.getLootQuantity(loot);
        const isStackable = await this.isLootItemStackable(loot);

        let remainingLootQuantity = lootQuantity;

        while (remainingLootQuantity > 0) {
          const lootItem = await this.createLootItemWithoutSaving(loot);
          const freeSlotId = itemContainer.firstAvailableSlotId;

          if (freeSlotId === null) {
            break;
          }

          if (isStackable) {
            lootItem.stackQty = remainingLootQuantity;
            remainingLootQuantity = 0;
          } else {
            remainingLootQuantity--;
          }

          itemContainer.slots[freeSlotId] = lootItem;
          bulkOps.push({ insertOne: { document: lootItem } });

          if (!isDeadBodyLootable) {
            npcBody.isDeadBodyLootable = true;
            isDeadBodyLootable = true;
          }
        }
      }
    }

    if (bulkOps.length > 0) {
      await Item.bulkWrite(bulkOps);
    }

    itemContainer.markModified("slots");
    await ItemContainer.updateOne({ _id: itemContainer._id, parentItem: npcBody._id }, itemContainer);
    await Item.updateOne(
      {
        _id: npcBody._id,
        scene: npcBody.scene,
      },
      npcBody
    );
  }

  private async createLootItemWithoutSaving(loot: INPCLoot): Promise<IItem> {
    const blueprintData = await blueprintManager.getBlueprint<IItem>(
      "items",
      loot.itemBlueprintKey as AvailableBlueprints
    );

    let lootItem = new Item({ ...blueprintData });

    const itemTypesWithoutRarity = [ItemType.CraftingResource, ItemType.Quest, ItemType.Information];

    if (lootItem.attack || (lootItem.defense && !itemTypesWithoutRarity.includes(lootItem.type as ItemType))) {
      const rarityAttributes = this.itemRarity.setItemRarityOnLootDrop(lootItem);
      lootItem = new Item({
        ...blueprintData,
        attack: rarityAttributes.attack,
        defense: rarityAttributes.defense,
        rarity: rarityAttributes.rarity,
      });
    }

    if (lootItem.subType === ItemSubType.Food) {
      const rarityAttributesFood = await this.itemRarity.setItemRarityOnLootDropForFood(lootItem);
      lootItem = new Item({
        ...blueprintData,
        healthRecovery: rarityAttributesFood?.healthRecovery,
        usableEffectDescription: rarityAttributesFood?.usableEffectDescription,
        rarity: rarityAttributesFood?.rarity,
      });
    }

    return lootItem;
  }

  private async fetchItemContainer(npcBody: IItem): Promise<IItemContainer> {
    const itemContainer = await ItemContainer.findById(npcBody.itemContainer);
    if (!itemContainer) {
      throw new Error(`Error fetching itemContainer for Item with key ${npcBody.key}`);
    }
    return itemContainer;
  }

  private async calculateLootChance(loot: INPCLoot, baseMultiplier = 1): Promise<number> {
    try {
      const blueprintData = await blueprintManager.getBlueprint<IItem>(
        "items",
        loot.itemBlueprintKey as AvailableBlueprints
      );

      if (!blueprintData) {
        throw new Error(`Error while calculating loot chance for item with key ${loot.itemBlueprintKey}`);
      }

      const lootMultiplier = this.getLootMultiplier(blueprintData);

      const finalMultiplier = lootMultiplier * baseMultiplier;

      const result = loot.chance * finalMultiplier;

      return result;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  private getLootMultiplier(blueprintData: IItem): number {
    if (blueprintData?.type === ItemType.CraftingResource) {
      return LOOT_CRAFTING_MATERIAL_DROP_CHANCE;
    }

    if (blueprintData?.subType === ItemSubType.Food) {
      return LOOT_FOOD_DROP_CHANCE;
    }

    if (blueprintData?.key === OthersBlueprint.GoldCoin) {
      return LOOT_GOLD_DROP_CHANCE;
    }

    // if none of the pre specified conditions are met, just return the default loot multiplier
    return NPC_LOOT_CHANCE_MULTIPLIER;
  }

  private getLootQuantity(loot: INPCLoot): number {
    if (loot.quantityRange && loot.quantityRange.length === 2) {
      return Math.round(random(loot.quantityRange[0], loot.quantityRange[1]));
    }
    return 1;
  }

  private async isLootItemStackable(loot: INPCLoot): Promise<boolean> {
    const blueprintData = await blueprintManager.getBlueprint<IItem>(
      "items",
      loot.itemBlueprintKey as AvailableBlueprints
    );
    const lootItem = new Item({ ...blueprintData });

    return lootItem.maxStackSize > 1;
  }
}
