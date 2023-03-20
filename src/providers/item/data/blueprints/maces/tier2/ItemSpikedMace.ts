import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSpikedMace: IEquippableMeleeTier2WeaponBlueprint = {
  key: MacesBlueprint.SpikedMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/spiked-mace.png",
  name: "Spiked Mace",
  description:
    "A mace with a heavy, spiked head mounted on a long handle. It is used for crushing and bludgeoning in close combat, and is often wielded by heavily-armored warriors.",
  attack: 17,
  defense: 7,
  tier: 2,
  weight: 2.9,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
};
