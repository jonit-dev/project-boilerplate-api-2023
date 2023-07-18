import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { provide } from "inversify-binding-decorators";
import { CharacterItemInventory } from "../characterItems/CharacterItemInventory";

import { IItem } from "@entities/ModuleInventory/ItemModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";

import { DecorateAllWith } from "@jonit-dev/decorators-utils";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";

@DecorateAllWith(TrackNewRelicTransaction())
@provide(CharacterWeightCalculator)
export class CharacterWeightCalculator {
  constructor(
    private characterItemInventory: CharacterItemInventory,
    private equipmentSlots: EquipmentSlots,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  public async getTotalCharacterCalculatedWeight(character: ICharacter): Promise<number> {
    const equipmentWeight = await this.calculateWeightFromEquipment(character);
    const inventoryWeight = await this.calculateWeightFromInventory(character);

    return equipmentWeight + inventoryWeight;
  }

  public async calculateWeightFromEquipment(character: ICharacter): Promise<number> {
    const cachedEquipmentWeight = (await this.inMemoryHashTable.get(
      "equipment-weight",
      character._id
    )) as unknown as number;

    if (cachedEquipmentWeight) {
      return cachedEquipmentWeight;
    }

    if (!character.equipment) {
      throw new Error("Character has no equipment");
    }

    await this.inMemoryHashTable.delete("equipment-slots", character._id);

    const results = await this.equipmentSlots.getEquipmentSlots(character._id, character.equipment.toString());

    const equipmentSlots = Object.values(results) as IItem[];

    const totalWeight = this.sumTotalWeightFromItems(equipmentSlots);

    await this.inMemoryHashTable.set("equipment-weight", character._id, totalWeight);

    return totalWeight;
  }

  public async calculateWeightFromInventory(character: ICharacter): Promise<number> {
    const cachedInventoryWeight = (await this.inMemoryHashTable.get(
      "inventory-weight",
      character._id
    )) as unknown as number;

    if (cachedInventoryWeight) {
      return cachedInventoryWeight;
    }

    const inventoryItems = await this.characterItemInventory.getAllItemsFromInventoryNested(character);

    const totalWeight = this.sumTotalWeightFromItems(inventoryItems);

    await this.inMemoryHashTable.set("inventory-weight", character._id, totalWeight);

    return totalWeight;
  }

  private sumTotalWeightFromItems(items: any[]): number {
    let totalWeight = 0;

    for (const item of items) {
      if (!item || !item?.weight) {
        continue;
      }

      const isStackable = item.stackQty! > 1 ?? false;

      if (isStackable) {
        totalWeight += item.weight * item.stackQty!;
      } else {
        totalWeight += item.weight;
      }
    }

    return Number(totalWeight.toFixed(2));
  }
}
