import { IEquippableLightArmorTier8Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSilvershadeLegs: IEquippableLightArmorTier8Blueprint = {
  key: LegsBlueprint.SilvershadeLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/silvershade-legs.png",
  name: "Silvershade Legs",
  description: "Woven with threads of silver, they glint mysteriously even in the faintest light.",
  weight: 0.8,
  defense: 44,
  tier: 8,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
