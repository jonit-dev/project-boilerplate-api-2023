import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalSpear: Partial<IItem> = {
  key: SpearsBlueprint.RoyalSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/royal-spear.png",
  textureKey: "royal-spear",
  name: "Royal Spear",
  description: "A spear whose elegance is immediately apparent. It was the sole preserve of royalty.",
  defense: 3,
  attack: 10,
  weight: 8,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
