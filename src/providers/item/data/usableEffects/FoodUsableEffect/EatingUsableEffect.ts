import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { shuffle } from "lodash";
import { IUsableEffect, UsableEffectsBlueprint } from "../types";

export const minorEatingUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.MinorEatingEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 1);
  },
  usableEffectDescription: "Restores 1 HP and Mana 5 times",
};

export const moderateEatingUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.ModerateEatingEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 3);
  },
  usableEffectDescription: "Restores 3 HP and Mana 5 times",
};

export const strongEatingUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.StrongEatingEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 4);
  },
  usableEffectDescription: "Restores 4 HP and Mana 5 times",
};

export const superStrongEatingUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.SuperStrongEatingEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 8);
  },
  usableEffectDescription: "Restores 8 HP and Mana 5 times",
};

export const poisonEatingUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.PoisonEatingEffect,
  usableEffect: (character: ICharacter) => {
    const socketMessaging = container.get<SocketMessaging>(SocketMessaging);
    const itemUsableEffect = container.get(ItemUsableEffect);

    const randomMessages = shuffle([
      "You shouldn't eat this raw food!",
      "You're suffering from food poisoning!",
      "You're feeling sick!",
    ]);

    socketMessaging.sendErrorMessageToCharacter(character, randomMessages[0]);

    itemUsableEffect.applyEatingEffect(character, -2);
  },
  usableEffectDescription: "This item should be cooked. Don't eat it raw or you'll get food poisoning.",
};
