import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSpellcastersHat: IEquippableLightArmorTier4Blueprint = {
  key: HelmetsBlueprint.SpellcastersHat,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/spellcasters-hat.png",
  name: "Spellcaster's Hat",
  description:
    "The Spellcaster's Hat is a distinctive and stylish headpiece that is favored by those who practice the arcane arts.",
  weight: 1,
  defense: 17,
  tier: 4,
  allowedEquipSlotType: [ItemSlotType.Head],
};
