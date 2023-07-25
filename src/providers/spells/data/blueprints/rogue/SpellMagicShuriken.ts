import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { HitTarget } from "@providers/battle/HitTarget";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { entityEffectBleeding } from "@providers/entityEffects/data/blueprints/entityEffectBleeding";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  CharacterClass,
  ISpell,
  MagicPower,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";

export const spellMagicShuriken: Partial<ISpell> = {
  key: SpellsBlueprint.MagicShuriken,
  name: "Magic Shuriken",
  description:
    "Unleash a mystical shuriken imbued with arcane energy, striking enemies with both physical and magical damage",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "ithil celebatharth",
  manaCost: 70,
  minLevelRequired: 5,
  minMagicLevelRequired: 5,
  cooldown: 20,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Shuriken,
  maxDistanceGrid: RangeTypes.Medium,
  characterClass: [CharacterClass.Rogue],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const entityEffectUse = container.get(EntityEffectUse);
    const hitTarget = container.get(HitTarget);

    await hitTarget.hit(character, target, true, MagicPower.High);

    await entityEffectUse.applyEntityEffects(target, character, entityEffectBleeding);

    return true;
  },
};
