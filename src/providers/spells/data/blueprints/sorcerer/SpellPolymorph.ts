import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterTextureChange } from "@providers/character/CharacterTextureChange";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  RangeTypes,
  SpellCastingType,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellPolymorph: Partial<ISpell> = {
  key: SpellsBlueprint.SpellPolymorph,

  name: "Polymorph Spell",
  description: "A spell that transforms target into a harmless rat for a short period.",

  castingType: SpellCastingType.RangedCasting,
  magicWords: "iquar ansr rattus",
  manaCost: 60,
  minLevelRequired: 8,
  minMagicLevelRequired: 5,
  cooldown: 10,
  targetHitAnimationKey: AnimationEffectKeys.HitBlue,
  castingAnimationKey: AnimationEffectKeys.ManaHeal,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  characterClass: [CharacterClass.Sorcerer],
  maxDistanceGrid: RangeTypes.Medium,

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const socketMessaging = container.get(SocketMessaging);
    const characterBuffActivator = container.get(CharacterBuffActivator);
    const characterTextureChange = container.get(CharacterTextureChange);

    const spellCalculator = container.get(SpellCalculator);

    // avoid self target
    if (character._id.toString() === target._id.toString()) {
      return false;
    }

    if (target.type === "NPC") {
      socketMessaging.sendErrorMessageToCharacter(character, "You can't cast this spell on a NPC.");
      return false;
    }

    const timeoutInSecs = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 15,
      max: 60,
    });

    const debuffPercentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, BasicAttribute.Magic, {
      max: 20,
      min: 5,
    });

    await characterBuffActivator.enableTemporaryBuff(target as ICharacter, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Strength,
      buffPercentage: -debuffPercentage,
      durationSeconds: timeoutInSecs,
      durationType: CharacterBuffDurationType.Temporary,
      options: {
        messages: {
          activation: `You feel weaker as a rat. Your strength and resistance are reduced by ${debuffPercentage}%.`,
          deactivation: "You feel stronger again.",
        },
      },
    });

    await characterBuffActivator.enableTemporaryBuff(target as ICharacter, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage: -debuffPercentage,
      durationSeconds: timeoutInSecs,
      durationType: CharacterBuffDurationType.Temporary,
      options: {
        messages: {
          skipAllMessages: true,
        },
      },
    });

    await characterTextureChange.changeTexture(target as ICharacter, "rat", timeoutInSecs, "polymorph");

    return true;
  },
};