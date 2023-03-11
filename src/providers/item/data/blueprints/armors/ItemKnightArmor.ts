import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemKnightArmor: Partial<IItem> = {
  key: ArmorsBlueprint.KnightArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/knight-armor.png",
  name: "Knight Armor",
  description:
    "Crafted from durable and sturdy materials such as steel or iron, Knight Armor is designed to offer a high degree of protection against physical attacks, while also providing a regal and imposing appearance.",
  weight: 3,
  defense: 25,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
