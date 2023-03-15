import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemJadeEmperorsArmor: IEquippableArmorBlueprint = {
  key: ArmorsBlueprint.JadeEmperorsArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/jade-emperors-armor.png",
  name: "Jade Emperor's Armor",
  description:
    "Crafted from rare and precious materials such as jade or gold, Jade Emperor's Armor is adorned with intricate designs.",
  defense: 20,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 120,
};
