import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IValidUseWithResponse } from "@providers/useWith/useWithTypes";
import { IUseWithItem, UseWithSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { UseWithHelper } from "./libs/UseWithHelper";

@provide(UseWithItem)
export class UseWithItem {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private useWithHelper: UseWithHelper
  ) {}

  public onUseWithItem(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, UseWithSocketEvents.UseWithItem, async (data: IUseWithItem, character) => {
      try {
        const { originItem, targetItem, useWithItemEffect } = await this.validateData(character, data);

        // call the useWithEffect function on target Item
        await useWithItemEffect!(targetItem!, originItem, character);
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**
   * Validates the input data and returns the IValidUseWithResponse for the items passed in data
   * @param character
   * @param data
   * @returns IValidUseWithResponse with the items that can be used with and the useWithEffect function defined for the targetItem
   */
  private async validateData(character: ICharacter, data: IUseWithItem): Promise<IValidUseWithResponse> {
    // Check if character is alive and not banned
    this.useWithHelper.basicValidations(character, data);

    if (!data.targetItemId) {
      throw new Error(`UseWithTile > Field 'targetItemId' is missing! data: ${JSON.stringify(data)}`);
    }

    // Check if character has the originItem and originItem on the equipment or inventory
    const originItem = await this.useWithHelper.getItem(character, data.originItemId);
    const targetItem = await this.useWithHelper.getItem(character, data.targetItemId);

    const itemWithUseWithEffect =
      itemsBlueprintIndex[originItem.baseKey].useWithItemEffect ||
      itemsBlueprintIndex[targetItem.baseKey].useWithItemEffect;

    if (!itemWithUseWithEffect) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this crafting interaction is not possible.");
      throw new Error(
        `Crafting interaction unavailable for items: Origin: ${originItem.baseKey} => Target: ${targetItem.baseKey}`
      );
    }

    return {
      originItem,
      targetItem,
      useWithItemEffect: itemWithUseWithEffect,
    };
  }
}
