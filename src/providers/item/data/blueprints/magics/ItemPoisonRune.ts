import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { IMagicItemUseWithEntity } from "@providers/useWith/useWithTypes";

import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonRune: Partial<IMagicItemUseWithEntity> = {
  key: MagicsBlueprint.PoisonRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/poison-rune.png",
  name: "Poison Rune",
  description: "An ancient poison rune.",
  weight: 0.01,
  maxStackSize: 100,
  allowedEquipSlotType: [ItemSlotType.Inventory],
  basePrice: 60,
  hasUseWith: true,
  canUseOnNonPVPZone: false,
  useWithMaxDistanceGrid: 7,
  power: 11,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.HitPoison,
  projectileAnimationKey: AnimationEffectKeys.Green,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const points = await calculateItemUseEffectPoints(MagicsBlueprint.PoisonRune, caster);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points, {
      canUseInNonPVPZone: false,
      caster,
    });

    return points;
  },
};
