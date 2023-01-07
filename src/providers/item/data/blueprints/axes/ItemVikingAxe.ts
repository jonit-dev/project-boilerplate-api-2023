import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemVikingAxe: Partial<IItem> = {
  key: AxesBlueprint.VikingAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/viking-axe.png",
  name: "Viking aAxe",
  description:
    "An axe with a broad, single-edged blade and a short, curved handle. It was commonly used by the Vikings in battle and is associated with Norse mythology.",
  attack: 20,
  defense: 5,
  weight: 4,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 64,
};
