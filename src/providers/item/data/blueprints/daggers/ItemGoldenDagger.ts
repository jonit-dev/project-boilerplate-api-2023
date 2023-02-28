import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenDagger: Partial<IItem> = {
  key: DaggersBlueprint.GoldenDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/golden-dagger.png",
  name: "Golden Dagger",
  description:
    "A small, single-edged knife with a golden blade and handle. It is often given as a symbol of wealth and status, and may be intricately decorated with engravings or gemstones.",
  weight: 1.6,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 10,
  defense: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 52,
};
