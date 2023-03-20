import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStuddedGloves: IEquippableLightArmorTier1Blueprint = {
  key: GlovesBlueprint.StuddedGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/studded-gloves.png",

  name: "Studded Gloves",
  description: "A pair of leather gloves with metal studs.",
  defense: 5,
  tier: 1,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 41,
};
