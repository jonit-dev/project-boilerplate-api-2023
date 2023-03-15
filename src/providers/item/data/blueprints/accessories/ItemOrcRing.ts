import { IEquippableItemBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemOrcRing: IEquippableItemBlueprint = {
  key: AccessoriesBlueprint.OrcRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/orc-ring.png",
  name: "Orc Ring",
  description:
    "A rough and crude ring made by orcs, a race of brutish and warlike creatures. It is a symbol of strength and ferocity, often worn by orcs as a sign of their martial prowess.",
  attack: 4,
  defense: 2,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 35,
};
