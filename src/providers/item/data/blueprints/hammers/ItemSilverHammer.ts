import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { HammersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSilverHammer: Partial<IItem> = {
  key: HammersBlueprint.SilverHammer,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "hammers/silver-hammer.png",
  name: "Silver Hammer",
  description:
    "A hammer with a silver head and handle. It is often given as a symbol of wealth and status, and may be intricately decorated with engravings or gemstones.",
  attack: 5,
  defense: 3,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
