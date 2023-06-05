import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationEffectKeys,
  CharacterClass,
  ISpell,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { PickPocket } from "../../logic/rogue/PickPocket";

export const spellPickPocket: Partial<ISpell> = {
  key: SpellsBlueprint.PickPocket,
  name: "PickPocket",
  description: "A spell designed for stealing an item from a character.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "levis manus",
  manaCost: 300,
  minLevelRequired: 20,
  minMagicLevelRequired: 25,
  cooldown: 300,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Rooted,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  maxDistanceGrid: RangeTypes.High,
  characterClass: [CharacterClass.Rogue],

  usableEffect: async (character: ICharacter, target: ICharacter) => {
    const pickPocket = container.get(PickPocket);
    const socketMessaging = container.get(SocketMessaging);

    const stealItem = await pickPocket.handlePickPocket(character, target);

    if (!stealItem) {
      socketMessaging.sendErrorMessageToCharacter(character, "You failed stealing!");
    }

    return stealItem;
  },
};
