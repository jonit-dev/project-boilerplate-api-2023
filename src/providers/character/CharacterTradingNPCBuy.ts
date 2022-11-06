import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { appEnv } from "@providers/config/env";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  CharacterTradeSocketEvents,
  ICharacterNPCTradeInitBuyResponse,
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  ItemSocketEvents,
  ITradeRequestItem,
  ITradeResponseItem,
  NPCMovementType,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterItemContainer } from "./characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterTradingValidation } from "./CharacterTradingValidation";
import { CharacterWeight } from "./CharacterWeight";

@provide(CharacterTradingNPCBuy)
export class CharacterTradingNPCBuy {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTradingBalance: CharacterTradingBalance,
    private characterItemContainer: CharacterItemContainer,
    private characterItemInventory: CharacterItemInventory,
    private characterWeight: CharacterWeight,
    private characterTradingValidation: CharacterTradingValidation
  ) {}

  public async initializeBuy(npcId: string, character: ICharacter): Promise<void> {
    const npc = await this.characterTradingValidation.validateAndReturnTraderNPC(npcId, character);

    if (!npc) {
      throw new Error("Failed to initialize buy transaction. NPC not found!");
    }

    const traderItems = npc?.traderItems?.map(({ key, price }) => {
      const { texturePath, name } = itemsBlueprintIndex[key] as IItem;

      return {
        key,
        price,
        texturePath,
        name,
      };
    }) as ITradeResponseItem[];

    const characterAvailableGold = await this.characterTradingBalance.getTotalGoldInInventory(character);

    // change NPC movement type to stopped
    await this.setFocusOnCharacter(npc, character);

    this.socketMessaging.sendEventToUser<ICharacterNPCTradeInitBuyResponse>(
      character.channelId!,
      CharacterTradeSocketEvents.TradeInit,
      {
        npcId: npc._id,
        type: "buy",
        traderItems: traderItems || [],
        characterAvailableGold,
      }
    );
  }

  public async buyItemsFromNPC(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): Promise<boolean> {
    const inventory = await character.inventory;
    const inventoryContainerId = inventory.itemContainer as unknown as string;

    if (!inventoryContainerId) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You don't have an inventory.");
      return false;
    }

    const isBuyTransactionValid = await this.validateBuyTransaction(character, npc, items);

    if (!isBuyTransactionValid) {
      return false;
    }

    for (const purchasedItem of items) {
      // check if the item to be purchased is actually available in the NPC

      const npcHasItem = npc?.traderItems?.some((traderItem) => traderItem.key === purchasedItem.key);

      if (!npcHasItem) {
        continue;
      }

      const itemPrice = npc?.traderItems?.find((traderItem) => traderItem.key === purchasedItem.key)?.price;

      if (!itemPrice) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "The item price is not valid for item " + purchasedItem.key
        );
        return false;
      }

      const isGoldDecremented = await this.characterItemInventory.decrementItemFromInventory(
        OthersBlueprint.GoldCoin,
        character,
        itemPrice * purchasedItem.qty
      );

      if (!isGoldDecremented) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "An error occurred while processing your purchase."
        );
        return false;
      }

      // create the new item representation on the database
      const itemBlueprint = itemsBlueprintIndex[purchasedItem.key] as Partial<IItem>;
      const isStackable = itemBlueprint?.maxStackSize! > 1;

      let wasItemAddedToContainer;

      if (isStackable) {
        // buy the whole stack at once
        const newItem = new Item({
          ...itemBlueprint,
          stackQty: purchasedItem.qty,
        });
        await newItem.save();

        // add it to the character's inventory
        wasItemAddedToContainer = await this.characterItemContainer.addItemToContainer(
          newItem,
          character,
          inventoryContainerId
        );
      } else {
        for (let i = 0; i < purchasedItem.qty; i++) {
          const newItem = new Item({
            ...itemBlueprint,
          });
          await newItem.save();

          // add it to the character's inventory
          wasItemAddedToContainer = await this.characterItemContainer.addItemToContainer(
            newItem,
            character,
            inventoryContainerId
          );
        }

        if (!wasItemAddedToContainer) {
          this.socketMessaging.sendErrorMessageToCharacter(
            character,
            "An error occurred while processing your purchase."
          );
          return false;
        }
      }
    }

    // finally, update character's weight
    await this.characterWeight.updateCharacterWeight(character);

    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: inventoryContainer,
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    };

    this.sendRefreshItemsEvent(payloadUpdate, character);

    return true;
  }

  private async setFocusOnCharacter(npc: INPC, character: ICharacter): Promise<void> {
    await NPC.updateOne(
      {
        _id: npc._id,
      },
      {
        $set: {
          currentMovementType: NPCMovementType.Stopped,
          targetCharacter: character._id,
        },
      }
    );

    // auto clear after 1 minute

    if (!appEnv.general.IS_UNIT_TEST) {
      setTimeout(async () => {
        await NPC.updateOne(
          {
            _id: npc._id,
          },
          {
            $set: {
              currentMovementType: npc.originalMovementType,
              targetCharacter: undefined,
            },
          }
        );
      }, 60 * 1000);
    }
  }

  private sendRefreshItemsEvent(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }

  private async validateBuyTransaction(
    character: ICharacter,
    npc: INPC,
    itemsToPurchase: ITradeRequestItem[]
  ): Promise<boolean> {
    const isBaseTransactionValid = this.characterTradingValidation.validateTransaction(character, npc, itemsToPurchase);

    if (!isBaseTransactionValid) {
      return false;
    }

    for (const item of itemsToPurchase) {
      const itemBlueprint = itemsBlueprintIndex[item.key] as Partial<IItem>;

      if (!itemBlueprint) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `Sorry, the item '${item.key}' is not available for purchase.`
        );
        return false;
      }

      const isStackable = itemBlueprint?.maxStackSize! > 1;

      if (isStackable && item.qty > itemBlueprint?.maxStackSize!) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `You can't buy more than the max stack size for the item '${itemBlueprint.name}'.`
        );
        return false;
      }
    }

    // Does the character has enough gold to purchase all required items?

    const totalCost = this.characterTradingBalance.calculateItemsTotalPrice(npc, itemsToPurchase);

    const characterTotalGoldInventory = await this.characterTradingBalance.getTotalGoldInInventory(character);

    const hasEnoughGold = characterTotalGoldInventory >= totalCost;

    if (!hasEnoughGold) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You don't have enough gold for this purchase.");
      return false;
    }

    return true;
  }
}
