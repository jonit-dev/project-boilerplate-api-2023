import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemYggdrasilTemplarSword: Partial<IItem> = {
  key: SwordsBlueprint.YggdrasilTemplarSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/yggdrasil-templar-sword.png",
  name: "¨Yggdrasil Templar Sword",
  description:
    "Crafted from the wood of the mystical Yggdrasil tree, this Templar sword possessed an ethereal quality that set it apart from all other weapons.",
  weight: 6,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 110,
  defense: 60,
  rangeType: EntityAttackType.Melee,
  isTwoHanded: true,
};
