import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRusticFlail: Partial<IItem> = {
  key: MacesBlueprint.RusticFlail,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/rustic-flail.png",
  name: "Rustic Flail",
  description: "A mace with a brown wooden handle and a round, spiky head made of rusted metal.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 6,
  rangeType: EntityAttackType.Melee,
  basePrice: 62,
};
