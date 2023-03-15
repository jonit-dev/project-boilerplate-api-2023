import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";

import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, IRuneItemBlueprint, ItemSubType, ItemType, RunePower } from "@rpg-engine/shared";
import { RangeTypes } from "../../types/RangedWeaponTypes";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireBoltRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.FireBoltRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/fire-bolt-rune.png",
  name: "Fire Bolt Rune",
  description: "An ancient Fire Bolt Rune.",
  weight: 0.01,
  maxStackSize: 100,
  hasUseWith: true,

  canUseOnNonPVPZone: false,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: RunePower.Medium,
  minMagicLevelRequired: 5,
  canSell: false,
  animationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Red,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireBoltRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);

    return points;
  },
};
