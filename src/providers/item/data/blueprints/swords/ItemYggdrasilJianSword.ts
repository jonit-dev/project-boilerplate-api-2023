import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemYggdrasilJianSword: Partial<IItem> = {
  key: SwordsBlueprint.YggdrasilJianSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/yggdrasil-jian-sword.png",
  name: "Yggdrasil Jian Sword",
  description:
    "Forged from the sturdy and mystical wood of Yggdrasil, this Jian sword boasts of unparalleled durability and sharpness.",
  weight: 1.7,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 90,
  defense: 30,
  rangeType: EntityAttackType.Melee,
  isTwoHanded: true,
};
