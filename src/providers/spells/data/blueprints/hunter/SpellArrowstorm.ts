import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SpellArea } from "@providers/battle/SpellArea";
import { SPELL_AREA_MEDIUM_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { entityEffectBleeding } from "@providers/entityEffects/data/blueprints/entityEffectBleeding";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  ISpell,
  MagicPower,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";

export const spellArrowStorm: Partial<ISpell> = {
  key: SpellsBlueprint.Arrowstorm,
  name: "Arrow Storm",
  description: "Unleashes a devastating barrage of enchanted arrows upon the targeted area.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "vanya lóte náren",
  manaCost: 70,
  minLevelRequired: 11,
  minMagicLevelRequired: 7,
  cooldown: 30,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Arrow,
  maxDistanceGrid: RangeTypes.High,

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);

    await spellArea.cast(character, target, MagicPower.Medium, {
      effectAnimationKey: AnimationEffectKeys.Execution,
      entityEffect: entityEffectBleeding,
      spellAreaGrid: SPELL_AREA_MEDIUM_BLAST_RADIUS,
    });

    return true;
  },
};
