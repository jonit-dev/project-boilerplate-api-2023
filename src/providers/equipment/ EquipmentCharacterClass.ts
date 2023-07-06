import { CharacterClass, ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(EquipmentCharacterClass)
export class EquipmentCharacterClass {
  private allowedItems = new Map<CharacterClass, ItemSubType[]>();

  constructor() {
    this.addAllowedItems();
  }

  private addAllowedItems(): void {
    this.allowedItems.set(CharacterClass.Berserker, [
      ItemSubType.Shield,
      ItemSubType.Sword,
      ItemSubType.Mace,
      ItemSubType.Dagger,
      ItemSubType.Axe,
    ]);
    this.allowedItems.set(CharacterClass.Warrior, [
      ItemSubType.Shield,
      ItemSubType.Sword,
      ItemSubType.Mace,
      ItemSubType.Dagger,
      ItemSubType.Axe,
    ]);
    this.allowedItems.set(CharacterClass.Rogue, [ItemSubType.Sword, ItemSubType.Shield, ItemSubType.Dagger]);
    this.allowedItems.set(CharacterClass.Druid, [ItemSubType.Staff, ItemSubType.Book, ItemSubType.Mace]);
    this.allowedItems.set(CharacterClass.Sorcerer, [ItemSubType.Staff, ItemSubType.Book, ItemSubType.Dagger]);
    this.allowedItems.set(CharacterClass.Hunter, [ItemSubType.Ranged, ItemSubType.Spear, ItemSubType.Shield]);
  }

  public isItemAllowed(characterType: string, itemSubType: string): boolean {
    if (itemSubType === "First") {
      return true;
    }

    const allowedItems = this.allowedItems.get(CharacterClass[characterType]);

    if (!allowedItems && characterType !== "None") {
      console.error("Character class not found: " + characterType);
      return false;
    }

    return allowedItems?.includes(ItemSubType[itemSubType]) || false;
  }
}
