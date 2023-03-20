import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemJadeEmperorsBoot: IEquippableLightArmorTier2Blueprint = {
  key: BootsBlueprint.JadeEmperorsBoot,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/jade-emperors-boot.png",
  name: "Jade Emperor's Boot",
  description:
    "The Jade Emperor's Boots are often associated with the majesty and power of Eastern mythology, as well as the agility and speed of characters who prioritize these traits in combat.",
  defense: 8,
  tier: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 80,
};
