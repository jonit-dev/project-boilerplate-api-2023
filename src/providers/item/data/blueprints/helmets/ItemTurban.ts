import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemTurban: Partial<IItem> = {
  key: HelmetsBlueprint.Turban,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/turban.png",
  textureKey: "turban",
  name: "Turban",
  description: "Simple cloth turban.",
  defense: 1,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Head],
};
