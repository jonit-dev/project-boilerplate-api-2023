import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemContainer, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { isArray } from "lodash";
import random from "lodash/random";

export interface IUseWithItemToEntityReward {
  key: string;
  qty: number[] | number;
  chance: number;
}

export interface IUseWithItemToEntityOptions {
  targetEntity: ICharacter | INPC;
  requiredResource?: {
    key: string;
    decrementQty: number;
    errorMessage: string;
  };
  targetEntityAnimationEffectKey?: string;

  successAnimationEffectKey?: string;
  errorAnimationEffectKey?: string;
  errorMessages?: string[];
  successMessages?: string[];
  rewards: IUseWithItemToEntityReward[];
}

@provide(UseWithItemToEntity)
export class UseWithItemToEntity {
  constructor(
    private animationEffect: AnimationEffect,
    private characterItemInventory: CharacterItemInventory,
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer
  ) {}

  public async execute(character: ICharacter, options: IUseWithItemToEntityOptions): Promise<void> {
    const {
      targetEntity,
      requiredResource,
      targetEntityAnimationEffectKey,
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
        const decrementRequiredItem = await this.characterItemInventory.decrementItemFromInventoryByKey(
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

    if (targetEntityAnimationEffectKey) {
      await this.animationEffect.sendAnimationEventToXYPosition(
        character,
        targetEntityAnimationEffectKey,
        targetEntity.x,
        targetEntity.y
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

  private async addRewardToInventory(character: ICharacter, rewards: IUseWithItemToEntityReward[]): Promise<boolean> {
    rewards = rewards.sort((a, b) => a.chance - b.chance);
    const n = random(0, 100);
    for (const reward of rewards) {
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
    const inventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer
    ).lean()) as unknown as IItemContainer;

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
