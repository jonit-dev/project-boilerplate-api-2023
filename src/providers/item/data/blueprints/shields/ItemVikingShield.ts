import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemVikingShield: Partial<IItem> = {
  key: ShieldsBlueprint.VikingShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/viking-shield.png",
  name: "Viking Shield",
  description:
    "It consists of thin planking, which forms a circular shape. In the middle is a dome of iron to protect the shield bearer's hand.",
  defense: 6,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  sellPrice: 13,
};
