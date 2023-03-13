import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemVikingBattleAxe: Partial<IItem> = {
  key: AxesBlueprint.VikingBattleAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/viking-battle-axe.png",
  name: "Viking Battle Axe",
  description:
    "A powerful weapon with a sharp blade and curved shape, designed for maximum damage and efficient hacking in battle.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 25,
  defense: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
