import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemKatana: IEquippableMeleeTier1WeaponBlueprint = {
  key: SwordsBlueprint.Katana,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/katana.png",
  name: "Katana",
  description:
    "A traditional Japanese sword with a curved, single-edged blade, known for its sharpness and versatility.",
  attack: 15,
  defense: 12,
  tier: 1,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
  entityEffects: [EntityEffectBlueprint.Bleeding],
  entityEffectChance: 80,
};
