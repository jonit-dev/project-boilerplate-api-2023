import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSpellcastersCape: IEquippableArmorBlueprint = {
  key: ArmorsBlueprint.SpellcastersCape,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/spellcasters-cape.png",
  name: "Spellcasters Cape",
  description:
    "Crafted from rare and exotic materials such as moonstone, star metal, or etherium, Spellcaster's Cape is adorned with intricate designs and symbols of arcane magic.",
  weight: 0.5,
  defense: 28,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
