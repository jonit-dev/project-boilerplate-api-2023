import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemContainer, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { isArray } from "lodash";
import random from "lodash/random";
import { IUseWithTargetTile } from "../useWithTypes";

interface IUseWithItemToTileReward {
  key: string;
  qty: number[] | number;
  chance: number;
}

export interface IUseWithItemToTileOptions {
  targetTile: IUseWithTargetTile;
  requiredResource?: {
    key: string;
    decrementQty: number;
    errorMessage: string;
  };
  targetTileAnimationEffectKey?: string;

  successAnimationEffectKey?: string;
  errorAnimationEffectKey?: string;
  errorMessages?: string[];
  successMessages?: string[];
  rewards: IUseWithItemToTileReward[];
}

@provide(UseWithItemToTile)
export class UseWithItemToTile {
  constructor(
    private animationEffect: AnimationEffect,
    private characterItemInventory: CharacterItemInventory,
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer
  ) {}

  public async execute(character: ICharacter, options: IUseWithItemToTileOptions): Promise<void> {
    const {
      targetTile,
      requiredResource,
      targetTileAnimationEffectKey,

      errorMessages,
      rewards,
      successAnimationEffectKey,
      successMessages,
      errorAnimationEffectKey,
    } = options;

    if (requiredResource) {
      const hasRequiredItem = await this.characterItemInventory.checkItemInInventoryByKey(
        requiredResource.key,
        character
      );

      if (!hasRequiredItem) {
        this.socketMessaging.sendErrorMessageToCharacter(character, requiredResource.errorMessage);
        return;
      }

      if (requiredResource.decrementQty) {
        const decrementRequiredItem = await this.characterItemInventory.decrementItemFromInventory(
          requiredResource.key,
          character,
          requiredResource.decrementQty
        );

        if (!decrementRequiredItem) {
          this.socketMessaging.sendErrorMessageToCharacter(character);
          return;
        }
      }
    }

    if (targetTileAnimationEffectKey) {
      await this.animationEffect.sendAnimationEventToXYPosition(
        character,
        targetTileAnimationEffectKey,
        targetTile.x,
        targetTile.y
      );
    }

    const addedRewardToInventory = await this.addRewardToInventory(character, rewards);

    if (!addedRewardToInventory) {
      if (errorMessages) {
        this.sendRandomMessageToCharacter(character, errorMessages);
      }

      if (errorAnimationEffectKey) {
        await this.animationEffect.sendAnimationEventToCharacter(character, errorAnimationEffectKey);
      }
      return;
    }

    if (successAnimationEffectKey) {
      await this.animationEffect.sendAnimationEventToCharacter(character, successAnimationEffectKey);
    }

    if (successMessages) {
      this.sendRandomMessageToCharacter(character, successMessages);
    }

    await this.refreshInventory(character);
  }

  private sendRandomMessageToCharacter(character: ICharacter, randomMessages: string[]): void {
    this.socketMessaging.sendErrorMessageToCharacter(character, randomMessages[random(0, randomMessages.length - 1)]);
  }

  private async addRewardToInventory(character: ICharacter, rewards: IUseWithItemToTileReward[]): Promise<boolean> {
    for (const reward of rewards) {
      const n = random(0, 100);

      if (n < reward.chance) {
        const itemBlueprint = itemsBlueprintIndex[reward.key];

        const item = new Item({
          ...itemBlueprint,
          stackQty: isArray(reward.qty) ? random(reward.qty[0], reward.qty[1]) : reward.qty,
        });
        await item.save();

        const inventory = await character.inventory;
        const inventoryContainerId = inventory.itemContainer as unknown as string;

        // add it to the character's inventory
        return await this.characterItemContainer.addItemToContainer(item, character, inventoryContainerId);
      }
    }

    return false;
  }

  private async refreshInventory(character: ICharacter): Promise<void> {
    const inventory = await character.inventory;
    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: inventoryContainer,
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    };

    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
