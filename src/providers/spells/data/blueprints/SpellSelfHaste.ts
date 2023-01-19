import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationEffectKeys,
  CharacterSocketEvents,
  ICharacterAttributeChanged,
  SpellCastingType,
} from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";

export const spellSelfHaste: Partial<ISpell> = {
  key: SpellsBlueprint.SelfHasteSpell,
  name: "Self Haste Spell",
  description: "A self haste spell.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas hiz",
  manaCost: 40,
  minLevelRequired: 5,
  minMagicLevelRequired: 5,
  animationKey: AnimationEffectKeys.LevelUp,

  usableEffect: (character: ICharacter) => {
    const socketMessaging = container.get(SocketMessaging);

    const increaseSpeed = 3;
    ItemUsableEffect.apply(character, EffectableAttribute.Speed, increaseSpeed);

    setTimeout(async () => {
      // This is needed for update channelId for eventListener
      const updateCharacter = await Character.findById(character._id);
      if (!updateCharacter) return;

      updateCharacter.baseSpeed = MovementSpeed.Slow;
      await updateCharacter.save();

      const payload: ICharacterAttributeChanged = {
        targetId: updateCharacter._id,
        speed: updateCharacter.speed,
      };

      socketMessaging.sendEventToUser(updateCharacter.channelId!, CharacterSocketEvents.AttributeChanged, payload);
    }, 1000 * 60 * 3);
  },
};
