import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWizardHat: IEquippableLightArmorTier0Blueprint = {
  key: HelmetsBlueprint.WizardHat,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/wizard-hat.png",
  name: "Wizard Hat",
  description: "A  Wizard Hat its a fine hat sewn of magickal fabrics. Popular more for its form than its function.",
  defense: 2,
  tier: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 37,
};
