import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWizardHat: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.WizardHat,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/wizard-hat.png",
  name: "Wizard Hat",
  description: "A  Wizard Hat its a fine hat sewn of magickal fabrics. Popular more for its form than its function.",
  defense: 5,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 37,
};
