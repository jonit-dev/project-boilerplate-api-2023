import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { HitTarget } from "@providers/battle/HitTarget";
import { SPELL_AREA_MEDIUM_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { entityEffectBleeding } from "@providers/entityEffects/data/blueprints/entityEffectBleeding";
import { container } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SpellArea } from "@providers/spells/area-spells/SpellArea";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterClass,
  CharacterSocketEvents,
  EntityType,
  ICharacterAttributeChanged,
  ISpell,
  MagicPower,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { random } from "lodash";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

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
  characterClass: [CharacterClass.Druid, CharacterClass.Sorcerer],

  usableEffect: async (caster: ICharacter | INPC, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);

    await spellArea.cast(caster, target, MagicPower.Medium, {
      effectAnimationKey: AnimationEffectKeys.Lifedrain,
      entityEffect: entityEffectBleeding,
      spellAreaGrid: SPELL_AREA_MEDIUM_BLAST_RADIUS,
      customFn: async (target: ICharacter | INPC) => {
        const hitTarget = container.get(HitTarget);
        const spellCalculator = container.get(SpellCalculator);
        const socketMessaging = container.get(SocketMessaging);

        const MAX_LIFE_STEAL_PERCENTAGE = 0.25;

        let potentialLifeSteal;

        switch (caster.type) {
          case EntityType.NPC:
            potentialLifeSteal = random(1, target.maxHealth * MAX_LIFE_STEAL_PERCENTAGE);
            await NPC.updateOne(
              {
                _id: caster._id,
              },
              {
                $inc: {
                  health: potentialLifeSteal,
                },
              }
            );

            break;
          case EntityType.Character:
            potentialLifeSteal = await spellCalculator.calculateBasedOnSkillLevel(
              caster as ICharacter,
              BasicAttribute.Magic,
              {
                min: 1,
                max: target.maxHealth * MAX_LIFE_STEAL_PERCENTAGE,
              }
            );
            await Character.updateOne(
              {
                _id: caster._id,
              },
              {
                $inc: {
                  health: potentialLifeSteal,
                },
              }
            );
            break;
        }

        await hitTarget.hit(caster, target, true, MagicPower.High, true);

        const payload: ICharacterAttributeChanged = {
          targetId: caster._id,
          health: potentialLifeSteal,
        };

        let character;

        if (target.type === EntityType.Character) {
          character = target as ICharacter;
        } else if (caster.type === EntityType.Character) {
          character = caster as ICharacter;
        }

        await socketMessaging.sendEventToCharactersAroundCharacter(
          character.channelId!,
          CharacterSocketEvents.AttributeChanged,
          payload
        );
      },
    });

    return true;
  },
};
