import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import shuffle from "lodash/shuffle";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRottenMeat: Partial<IItem> = {
  key: FoodsBlueprint.RottenMeat,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/rotten-meat.png",
  name: "Rotten Meat",
  description: "A piece of rotten meat. Don't eat it!",
  weight: 0.25,
  maxStackSize: 50,
  basePrice: 1,
  usableEffect: (character: ICharacter) => {
    const socketMessaging = container.get<SocketMessaging>(SocketMessaging);

    const randomMessages = shuffle([
      "You shouldn't eat this rotten meat!",
      "You're suffering from food poisoning!",
      "You're feeling sick!",
    ]);

    socketMessaging.sendErrorMessageToCharacter(character, randomMessages[0]);

    ItemUsableEffect.applyEatingEffect(character, -2);
  },
};
