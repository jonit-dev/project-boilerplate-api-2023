import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSpellcastersHat: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.SpellcastersHat,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/spellcasters-hat.png",
  name: "Spellcaster's Hat",
  description:
    "The Spellcaster's Hat is a distinctive and stylish headpiece that is favored by those who practice the arcane arts.",
  weight: 1,
  defense: 16,
  allowedEquipSlotType: [ItemSlotType.Head],
};
