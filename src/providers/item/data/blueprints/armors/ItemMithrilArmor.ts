import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMithrilArmor: Partial<IItem> = {
  key: ArmorsBlueprint.MithrilArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/mithril-armor.png",
  name: "Mithril armor",
  description:
    "A legendary armor forged from a rare, incredibly strong metal that is light, durable, and highly sought after.",
  defense: 30,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 160,
};
