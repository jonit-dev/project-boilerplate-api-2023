import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import shuffle from "lodash/shuffle";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRawBeefSteak: Partial<IItem> = {
  key: FoodsBlueprint.RawBeefSteak,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/raw-beef-steak.png",
  name: "Raw Beef Steak",
  description: "A raw beef steak that can be used for cooking, but shouldn't be consumed raw.",
  weight: 3,
  maxStackSize: 10,
  basePrice: 20,
  hasUseWith: true,
  usableEffect: (character: ICharacter) => {
    const socketMessaging = container.get<SocketMessaging>(SocketMessaging);

    const randomMessages = shuffle([
      "You shouldn't eat this raw beef!",
      "You're suffering from food poisoning!",
      "You're feeling sick!",
    ]);

    socketMessaging.sendErrorMessageToCharacter(character, randomMessages[0]);

    ItemUsableEffect.applyEatingEffect(character, -1);
  },
};
