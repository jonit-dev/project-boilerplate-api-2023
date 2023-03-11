import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFarmersBoot: Partial<IItem> = {
  key: BootsBlueprint.FarmersBoot,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/farmers-boot.png",
  name: "Farmers Boot",
  description:
    "The boots also provide some protection against environmental hazards such as mud or shallow water, making them a practical choice for farmers or other characters who spend a lot of time outdoors.",
  weight: 1,
  defense: 3,
};
