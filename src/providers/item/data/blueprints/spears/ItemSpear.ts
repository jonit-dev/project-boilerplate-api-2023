import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSpear: Partial<IItem> = {
  key: SpearsBlueprint.Spear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/spear.png",
  name: "Spear",
  description: "A standard wooden spear with metal tip.",
  attack: 5,
  defense: 2,
  weight: 3,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 7,
  rangeType: EntityAttackType.Melee,
  maxStackSize: 100,
  sellPrice: 50,
};
