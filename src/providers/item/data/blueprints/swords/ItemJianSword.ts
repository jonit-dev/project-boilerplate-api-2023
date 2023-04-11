import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemJianSword: Partial<IItem> = {
  key: SwordsBlueprint.JianSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/jian-sword.png",
  name: "jian-sword",
  description:
    "The Jian sword is a traditional Chinese weapon that has been used for centuries by warriors and martial artists alike.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 35,
  defense: 5,
  rangeType: EntityAttackType.Melee,
};
