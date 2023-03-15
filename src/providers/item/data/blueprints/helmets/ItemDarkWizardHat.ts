import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDarkWizardHat: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.DarkWizardHat,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/dark-wizard-hat.png",
  name: "Dark Wizard Hat",
  description: "Black mage hide their faces in the shadows of their Black  Hats.",
  defense: 7,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 37,
};
