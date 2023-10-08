import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { shuffle } from "lodash";
import { IUsableEffect, UsableEffectsBlueprint } from "../types";

export const recoveryPowerLevels = {
  [UsableEffectsBlueprint.MinorEatingEffect]: 1,
  [UsableEffectsBlueprint.ModerateEatingEffect]: 5,
  [UsableEffectsBlueprint.StrongEatingEffect]: 7,
  [UsableEffectsBlueprint.SuperStrongEatingEffect]: 10,
  [UsableEffectsBlueprint.PoisonEatingEffect]: -2,
};

function createEatingUsableEffect(key: UsableEffectsBlueprint, description: string): IUsableEffect {
  return {
    key,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    usableEffect: async (character: ICharacter, extraValue: number) => {
      const itemUsableEffect = container.get(ItemUsableEffect);
      const value = extraValue || recoveryPowerLevels[key];
      await itemUsableEffect.applyEatingEffect(character, value);
    },
    usableEffectDescription: description,
  };
}

export const minorEatingUsableEffect = createEatingUsableEffect(
  UsableEffectsBlueprint.MinorEatingEffect,
  "Restores 1 HP and Mana 5 times"
);

export const moderateEatingUsableEffect = createEatingUsableEffect(
  UsableEffectsBlueprint.ModerateEatingEffect,
  "Restores 5 HP and Mana 5 times"
);

export const strongEatingUsableEffect = createEatingUsableEffect(
  UsableEffectsBlueprint.StrongEatingEffect,
  "Restores 7 HP and Mana 5 times"
);

export const superStrongEatingUsableEffect = createEatingUsableEffect(
  UsableEffectsBlueprint.SuperStrongEatingEffect,
  "Restores 10 HP and Mana 5 times"
);

export const poisonEatingUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.PoisonEatingEffect,
  usableEffect: async (character: ICharacter, extraValue: number) => {
    const socketMessaging = container.get<SocketMessaging>(SocketMessaging);
    const itemUsableEffect = container.get(ItemUsableEffect);

    const randomMessages = shuffle([
      "You shouldn't eat this raw food!",
      "You're suffering from food poisoning!",
      "You're feeling sick!",
    ]);

    socketMessaging.sendErrorMessageToCharacter(character, randomMessages[0]);
    const value = extraValue || recoveryPowerLevels[UsableEffectsBlueprint.PoisonEatingEffect];
    await itemUsableEffect.applyEatingEffect(character, value);
  },
  usableEffectDescription: "This item should be cooked. Don't eat it raw or you'll get food poisoning.",
};
