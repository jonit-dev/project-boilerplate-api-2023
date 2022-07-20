import { IItem, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBluePrint } from "../../types/itemsBlueprintTypes";

export const itemDagger: Partial<IItem> = {
  key: DaggersBluePrint.Dagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/dagger.png",
  textureKey: "dagger",
  name: "Dagger",
  description:
    "You see a dagger. It's a fighting knife with a very sharp point and usually two sharp edges, typically designed or capable of being used as a thrusting or stabbing weapon.",
  defense: 1,
  attack: 3,
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
