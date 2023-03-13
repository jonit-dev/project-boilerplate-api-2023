import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWhiteDragonSpear: Partial<IItem> = {
  key: SpearsBlueprint.WhiteDragonSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/white-dragon-spear.png",
  name: "White Dragon Spear",
  description:
    "A white spear adorned with stars and other celestial decorations, with a sharp, pointed tip imbued with celestial power.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 28,
  defense: 16,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 65,
};
