import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangedBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSlingshot: Partial<IItem> = {
  key: RangedBlueprint.Slingshot,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/slingshot.png",
  textureKey: "slingshot",
  name: "Wooden Slingshot",
  description:
    "A weapon used for shooting stones and usually made of a strip of wood bent by a cord connecting the two end.",
  attack: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 4,
  requiredAmmoKey: RangedBlueprint.Stone,
  isTwoHanded: true,
};