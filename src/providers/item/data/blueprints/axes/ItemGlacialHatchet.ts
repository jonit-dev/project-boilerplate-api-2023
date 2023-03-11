import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGlacialHatchet: Partial<IItem> = {
  key: AxesBlueprint.GlacialHatchet,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/glacial-hatchet.png",
  name: "Glacial Hatchet",
  description:
    "This hatchet is crafted from rare and enchanted ice crystals that were harvested from the depths of frozen glaciers.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 18,
  defense: 4,
  rangeType: EntityAttackType.Melee,
};
