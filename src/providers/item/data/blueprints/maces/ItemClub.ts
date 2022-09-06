import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { MacesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemClub: Partial<IItem> = {
  key: MacesBlueprint.Club,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/club.png",
  textureKey: "club",
  name: "Club",
  description: "A simple wooden club.",
  attack: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
