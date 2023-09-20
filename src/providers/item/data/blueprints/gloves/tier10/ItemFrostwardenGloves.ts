import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier10Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostwardenGloves: IEquippableLightArmorTier10Blueprint = {
  key: GlovesBlueprint.FrostwardenGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/frostwarden-gloves.png",
  name: "Frostwarden Gloves",
  description: "Sculpted from glacial ice, they imbue the wearer with the chill of the Arctic winds.",
  defense: 58,
  tier: 10,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 135,
};
