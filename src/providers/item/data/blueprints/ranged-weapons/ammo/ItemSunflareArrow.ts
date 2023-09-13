import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSunflareArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.SunflareArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/sunflare-arrow.png",
  name: "Sunflare Arrow",
  description:
    "Infused with the essence of the sun, these arrows burn brightly. Excellent for blinding foes or illuminating dark areas.",
  weight: 0.1,
  maxStackSize: 999,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 6,
  attack: 16,
  canSell: false,
};
