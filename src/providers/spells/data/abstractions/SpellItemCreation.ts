import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { AnimationEffectKeys } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

interface ISpellItemCreationOptions {
  itemToCreate: {
    key: string;
    createQty?: number;
    onErrorMessage?: string;
  };
  itemToConsume?: {
    key: string;
    decrementQty?: number;
    onErrorMessage?: string;
  };
}

@provide(SpellItemCreation)
export class SpellItemCreation {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemInventory: CharacterItemInventory,
    private characterInventory: CharacterInventory,
    private animationEffect: AnimationEffect
  ) {}

  @TrackNewRelicTransaction()
  public async createItem(character: ICharacter, options: ISpellItemCreationOptions): Promise<boolean> {
    const { itemToCreate, itemToConsume } = options;

    if (itemToConsume?.key) {
      const removed = await this.characterItemInventory.decrementItemFromInventoryByKey(
        itemToConsume.key,
        character,
        itemToConsume.decrementQty || 1
      );
      if (!removed) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          itemToConsume.onErrorMessage || "Sorry, something went wrong."
        );
        return false;
      }
    }

    const added = await this.characterItemInventory.addItemToInventory(itemToCreate.key, character, {
      stackQty: itemToCreate.createQty || 1,
    });

    if (!added) {
      await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.Miss);

      return false;
    }

    if (added) {
      await this.characterInventory.sendInventoryUpdateEvent(character);
      return true;
    }

    this.socketMessaging.sendErrorMessageToCharacter(
      character,
      itemToCreate.onErrorMessage || "Sorry, something went wrong."
    );

    return false;
  }
}
