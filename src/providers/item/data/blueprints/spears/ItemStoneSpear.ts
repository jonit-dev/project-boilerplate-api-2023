import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStoneSpear: Partial<IItem> = {
  key: SpearsBlueprint.StoneSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/stone-spear.png",
  name: "Stone Spear",
  description:
    "BA primitive melee weapon made of a wooden stick and a pointed head made of stone. It is a basic but effective weapon that can be used for thrusting and stabbing attacks.",
  attack: 5,
  defense: 3,
  weight: 3,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 7,
  rangeType: EntityAttackType.Melee,

  basePrice: 40,
};
