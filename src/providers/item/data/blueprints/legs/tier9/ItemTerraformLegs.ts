import { IEquippableLightArmorTier9Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemTerraformLegs: IEquippableLightArmorTier9Blueprint = {
  key: LegsBlueprint.TerraformLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/terraform-legs.png",
  name: "Terraform Legs",
  description: "Infused with the spirit of the earth, these pants provide unmatched stability.",
  weight: 0.6,
  defense: 50,
  tier: 9,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
