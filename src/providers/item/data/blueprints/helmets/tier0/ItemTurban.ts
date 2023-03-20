import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemTurban: IEquippableLightArmorTier0Blueprint = {
  key: HelmetsBlueprint.Turban,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/turban.png",
  name: "Turban",
  description: "Simple cloth turban.",
  defense: 3,
  tier: 0,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 29,
};
