import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemTurban: Partial<IItem> = {
  key: "turban",
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
