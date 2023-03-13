import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWhiteRavenAxe: Partial<IItem> = {
  key: AxesBlueprint.WhiteRavenAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/white-raven-axe.png",
  name: "White Raven Axe",
  description:
    "A mysterious white axe with a metal head and a handle adorned with black feathers, used by shamans to commune with the spirit world.",
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 24,
  defense: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 62,
};
