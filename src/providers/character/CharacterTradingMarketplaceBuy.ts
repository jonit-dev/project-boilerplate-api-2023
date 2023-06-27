import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { IMarketplaceItem } from "@entities/ModuleMarketplace/MarketplaceItemModel";
import { MarketplaceMoney } from "@entities/ModuleMarketplace/MarketplaceMoneyModel";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import {
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  IMarketplaceAvailableMoneyNotification,
  MarketplaceSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterTradingBuy } from "./CharacterTradingBuy";
import { CharacterWeight } from "./CharacterWeight";
import { CharacterItemContainer } from "./characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";
import { CharacterItemSlots } from "./characterItems/CharacterItemSlots";

@provide(CharacterTradingMarketplaceBuy)
export class CharacterTradingMarketplaceBuy {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTradingBalance: CharacterTradingBalance,
    private characterTradingBuy: CharacterTradingBuy,
    private characterInventory: CharacterInventory,
    private characterItemSlots: CharacterItemSlots,
    private characterItemInventory: CharacterItemInventory,
    private characterItemContainer: CharacterItemContainer,
    private characterWeight: CharacterWeight,
    private characterRepository: CharacterRepository
  ) {}

  public async buyItem(character: ICharacter, marketplaceItem: IMarketplaceItem): Promise<boolean> {
    const isTransactionValid = await this.validateBuyTransaction(character, marketplaceItem);
    if (!isTransactionValid) {
      return false;
    }

    const decrementedGold = await this.characterItemInventory.decrementItemFromNestedInventoryByKey(
      OthersBlueprint.GoldCoin,
      character,
      marketplaceItem.price
    );
    if (!decrementedGold.success) {
      return false;
    }

    const itemToBuy = marketplaceItem.item as unknown as IItem;
    const inventory = await this.characterInventory.getInventory(character);
    const inventoryContainerId = inventory?.itemContainer as unknown as string;

    const wasItemAddedToContainer = await this.characterItemContainer.addItemToContainer(
      itemToBuy,
      character,
      inventoryContainerId
    );
    if (!wasItemAddedToContainer) {
      return false;
    }

    await this.characterWeight.updateCharacterWeight(character);

    const inventoryContainer = (await ItemContainer.findById(inventory?.itemContainer)) as unknown as IItemContainer;

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: inventoryContainer,
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    };

    this.characterTradingBuy.sendRefreshItemsEvent(payloadUpdate, character);

    await clearCacheForKey(`${character._id}-inventory`);

    await this.addMoneyToSellerMarketplaceBalance(marketplaceItem);

    await marketplaceItem.delete();

    return true;
  }

  private async addMoneyToSellerMarketplaceBalance(marketplaceItem: IMarketplaceItem): Promise<boolean> {
    const seller = marketplaceItem.owner as unknown as string;

    let marketplaceOwnerBalance = await MarketplaceMoney.findOne({ owner: seller });
    if (!marketplaceOwnerBalance) {
      marketplaceOwnerBalance = new MarketplaceMoney({ owner: seller, money: 0 });
      await marketplaceOwnerBalance.save();
    }

    const updatedMoney = marketplaceOwnerBalance.money + marketplaceItem.price;
    await marketplaceOwnerBalance.updateOne({ money: updatedMoney });

    const sellerCharacter = await this.characterRepository.findById(seller);
    if (sellerCharacter?.isOnline) {
      this.socketMessaging.sendEventToUser<IMarketplaceAvailableMoneyNotification>(
        sellerCharacter?.channelId!,
        MarketplaceSocketEvents.AvailableMoneyNotification,
        {
          moneyAvailable: updatedMoney,
        }
      );
    }

    return true;
  }

  private async validateBuyTransaction(character: ICharacter, marketplaceItem: IMarketplaceItem): Promise<boolean> {
    await marketplaceItem.updateOne({ isBeingBought: true });

    const inventory = await this.characterInventory.getInventory(character);
    const inventoryContainerId = inventory?.itemContainer as unknown as string;
    if (!inventoryContainerId) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You don't have an inventory.");
      return false;
    }

    const hasAvailableSlot = await this.characterItemSlots.hasAvailableSlot(
      inventoryContainerId,
      marketplaceItem.item as unknown as IItem
    );
    if (!hasAvailableSlot) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You don't have enough space in your inventory.");
      return false;
    }

    const characterAvailableGold = await this.characterTradingBalance.getTotalGoldInInventory(character);
    if (characterAvailableGold < marketplaceItem.price) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You don't have enough gold.");
      return false;
    }

    return true;
  }
}
