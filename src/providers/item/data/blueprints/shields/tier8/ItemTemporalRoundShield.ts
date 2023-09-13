import { IEquippableArmorTier8Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemTemporalRoundShield: IEquippableArmorTier8Blueprint = {
  key: ShieldsBlueprint.TemporalRoundShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/temporal-round-shield.png",
  name: "Temporal Round Shield",
  description:
    "Infused with time-altering magic, this shield can slow down incoming projectiles. Effective against archers and long-range attacks.",
  weight: 1.2,
  defense: 64,
  tier: 8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
