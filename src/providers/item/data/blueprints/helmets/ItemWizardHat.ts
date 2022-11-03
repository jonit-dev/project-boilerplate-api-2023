import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWizardHat: Partial<IItem> = {
  key: HelmetsBlueprint.WizardHat,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/wizard-hat.png",
  name: "Wizard Hat",
  description: "A  Wizard Hat its a fine hat sewn of magickal fabrics. Popular more for its form than its function.",
  defense: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
  sellPrice: 10,
};
