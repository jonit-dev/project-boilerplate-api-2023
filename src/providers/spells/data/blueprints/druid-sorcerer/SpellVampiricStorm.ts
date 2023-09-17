import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { HitTarget } from "@providers/battle/HitTarget";
import { SPELL_AREA_MEDIUM_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { entityEffectBleeding } from "@providers/entityEffects/data/blueprints/entityEffectBleeding";
import { container } from "@providers/inversify/container";
import { SpellArea } from "@providers/spells/area-spells/SpellArea";
import {
  AnimationEffectKeys,
  CharacterClass,
  ISpell,
  MagicPower,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellLifeSteal } from "../../logic/other/SpellLifeSteal";

export const spellVampiricStorm: Partial<ISpell> = {
  key: SpellsBlueprint.VampiricStorm,
  name: "Vampiric Storm",
  description:
    "This dark vortex drains the life essence of enemies caught within its pull, simultaneously restoring the health of the caster.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "sanguis tempestas nox",
  manaCost: 120,
  minLevelRequired: 12,
  minMagicLevelRequired: 8,
  cooldown: 30,
  castingAnimationKey: AnimationEffectKeys.LifeHeal,
  targetHitAnimationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Red,
  maxDistanceGrid: RangeTypes.High,
  characterClass: [CharacterClass.Druid],

  usableEffect: async (caster: ICharacter | INPC, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);

    const spellLifeSteal = container.get(SpellLifeSteal);

    await spellArea.cast(caster, target, MagicPower.Medium, {
      effectAnimationKey: AnimationEffectKeys.Lifedrain,
      entityEffect: entityEffectBleeding,
      spellAreaGrid: SPELL_AREA_MEDIUM_BLAST_RADIUS,
      customFn: async (target: ICharacter | INPC) => {
        const hitTarget = container.get(HitTarget);

        await hitTarget.hit(caster, target, true, MagicPower.High, true);

        await spellLifeSteal.performLifeSteal(caster, target);
      },
    });

    return true;
  },
};
