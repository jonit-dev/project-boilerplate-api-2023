import { IEquippableArmorTier9Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBladeBarrier: IEquippableArmorTier9Blueprint = {
  key: ShieldsBlueprint.BladeBarrier,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/blade-barrier.png",
  name: "Blade Barrier",
  description:
    "Outfitted with retractable blades, this shield can also be used for offense. A two-in-one choice for the adaptable warrior.",
  weight: 1.5,
  defense: 70,
  tier: 9,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
