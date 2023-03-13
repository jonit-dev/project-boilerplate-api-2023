import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEarthbinderSpear: Partial<IItem> = {
  key: SpearsBlueprint.EarthbinderSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/earthbinder-spear.png",
  name: "Earthbinder Spear",
  description: "A long spear with a brown wooden shaft and a spearhead made of stone or obsidian.",
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 25,
  defense: 13,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
};
