import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SPELL_AREA_ULTIMATE_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { entityEffectBurning } from "@providers/entityEffects/data/blueprints/entityEffectBurning";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SpellArea } from "@providers/spells/area-spells/SpellArea";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterClass,
  ISpell,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellArcaneExplosion: Partial<ISpell> = {
  key: SpellsBlueprint.ArcaneExplosion,
  name: "Arcane Explosion",
  description: "A devastating arcane spell so powerful that not even the caster can emerge unscathed.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "thaltha aranel",
  manaCost: 1200,
  minLevelRequired: 45,
  minMagicLevelRequired: 40,
  cooldown: 180,
  castingAnimationKey: AnimationEffectKeys.FireBall,
  targetHitAnimationKey: AnimationEffectKeys.FireBall,
  projectileAnimationKey: AnimationEffectKeys.HitFire,
  maxDistanceGrid: RangeTypes.UltraShort,
  characterClass: [CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);
    const spellCalculator = container.get(SpellCalculator);
    const itemUsableEffect = container.get(ItemUsableEffect);

    const skillDamage = await spellCalculator.spellDamageCalculator(character, BasicAttribute.Magic, {
      minSkillMultiplier: 3.2,
      maxSkillMultiplier: 4.5,
      level: true,
      minLevelMultiplier: 0.8,
      maxLevelMultiplier: 1.5,
    });

    let selfDamage = skillDamage * 0.1;

    if (selfDamage >= character.health) {
      selfDamage = character.health - 1;
    }

    await spellArea.cast(character, character, skillDamage, {
      effectAnimationKey: AnimationEffectKeys.Burn,
      spellAreaGrid: SPELL_AREA_ULTIMATE_BLAST_RADIUS,
      entityEffect: entityEffectBurning,
    });

    await itemUsableEffect.apply(character, EffectableAttribute.Health, -selfDamage);

    return true;
  },
};
