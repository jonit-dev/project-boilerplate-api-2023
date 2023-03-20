import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHuntersCap: IEquippableLightArmorTier0Blueprint = {
  key: HelmetsBlueprint.HuntersCap,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/hunters-cap.png",
  name: "Hunters Cap",
  description:
    "The Hunter's Cap is a lightweight and durable headpiece that is perfect for those who roam the wilderness in search of prey. ",
  weight: 1,
  defense: 4,
  tier: 0,
  allowedEquipSlotType: [ItemSlotType.Head],
};
