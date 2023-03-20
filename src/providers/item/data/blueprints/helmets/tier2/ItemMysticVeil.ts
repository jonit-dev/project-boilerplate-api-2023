import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMysticVeil: IEquippableLightArmorTier2Blueprint = {
  key: HelmetsBlueprint.MysticVeil,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/mystic-veil.png",
  name: "Mystic Veil",
  description: "The Mystic Veil is a mysterious and enchanting headpiece that is shrouded in magic and intrigue.",
  weight: 1,
  defense: 10,
  tier: 2,
  allowedEquipSlotType: [ItemSlotType.Head],
};
