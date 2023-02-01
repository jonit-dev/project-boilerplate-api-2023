import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { IMagicItemUseWithEntity } from "@providers/useWith/useWithTypes";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.FireRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/fire-rune.png",
  name: "Fire Rune",
  description: "An ancient fire rune.",
  weight: 0.01,
  maxStackSize: 100,
  allowedEquipSlotType: [ItemSlotType.Inventory],
  basePrice: 60,
  hasUseWith: true,

  useWithMaxDistanceGrid: 7,
  power: 10,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.HitFire,
  projectileAnimationKey: AnimationEffectKeys.FireBall,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);

    return points;
  },
};
