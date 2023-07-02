import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";

import { container } from "@providers/inversify/container";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import {
  AnimationEffectKeys,
  BasicAttribute,
  IRuneItemBlueprint,
  ItemSubType,
  ItemType,
  MagicPower,
  RangeTypes,
} from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHealRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.HealRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/heal-rune.png",

  name: "Healing Rune",
  description: "An ancient healing rune.",
  weight: 0.01,
  maxStackSize: 100,

  hasUseWith: true,
  canUseOnNonPVPZone: true,
  useWithMaxDistanceGrid: RangeTypes.Short,
  power: MagicPower.UltraHigh,
  minMagicLevelRequired: RangeTypes.High,
  canSell: false,
  animationKey: AnimationEffectKeys.HitHeal,
  projectileAnimationKey: AnimationEffectKeys.Heal,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const spellCalculator = container.get(SpellCalculator);

    const percentage = await spellCalculator.calculateBuffBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 50,
      max: 100,
    });

    const totalAmount = (caster.maxHealth * percentage) / 100;

    itemUsableEffect.apply(target, EffectableAttribute.Health, totalAmount);
  },

  usableEffectDescription: "Restores 50-100% of health, based on Magic skill level",
};
