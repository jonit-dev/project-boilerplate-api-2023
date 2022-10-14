import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ITradeItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterItemContainer } from "./characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterTradingValidation } from "./CharacterTradingValidation";
import { CharacterWeight } from "./CharacterWeight";

@provide(CharacterTradingNPCBuy)
export class CharacterTradingNPCBuy {
  constructor(
    private movementHelper: MovementHelper,
    private socketMessaging: SocketMessaging,
    private characterTradingBalance: CharacterTradingBalance,
    private characterItemContainer: CharacterItemContainer,
    private characterItemInventory: CharacterItemInventory,
    private characterWeight: CharacterWeight,
    private characterTradingValidation: CharacterTradingValidation
  ) {}

  public async buyItemsFromNPC(character: ICharacter, npc: INPC, items: ITradeItem[]): Promise<boolean> {
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

    // if we reached this point, it means the purchase is valid. Let's proceed...

    // first, decrement the gold from the character inventory
    const totalCost = this.characterTradingBalance.calculateItemsTotalPrice(npc, items);

    const isGoldDecremented = await this.characterItemInventory.decrementItemFromInventory(
      OthersBlueprint.GoldCoin,
      character,
      totalCost
    );

    if (!isGoldDecremented) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "An error occurred while processing your purchase.");
      return false;
    }

    // then, add the purchased items to the character inventory

    for (const purchasedItem of items) {
      // check if the item to be purchased is actually available in the NPC

      const npcHasItem = npc?.traderItems?.some((traderItem) => traderItem.key === purchasedItem.key);

      if (!npcHasItem) {
        continue;
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

    return true;
  }

  private async validateBuyTransaction(
    character: ICharacter,
    npc: INPC,
    itemsToPurchase: ITradeItem[]
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
          `Sorry, the item '${item.name}' is not available for purchase.`
        );
        return false;
      }

      const isStackable = itemBlueprint?.maxStackSize! > 1;

      if (isStackable && item.qty > itemBlueprint?.maxStackSize!) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `You can't buy more than the max stack size for the item '${item.name}'.`
        );
        return false;
      }
    }

    //  Is the character near the seller NPC?
    const isUnderRange = this.movementHelper.isUnderRange(character.x, character.y, npc.x, npc.y, 2);

    if (!isUnderRange) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You are too far away from the seller.");
      return false;
    }

    // Does the character has enough gold to purchase all required items?

    const totalCost = this.characterTradingBalance.calculateItemsTotalPrice(npc, itemsToPurchase);

    const characterTotalGoldInventory = await this.characterTradingBalance.getTotalGoldInInventory(character);

    const hasEnoughGold = characterTotalGoldInventory >= totalCost;

    if (!hasEnoughGold) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You don't have enough gold make this purchase.");
      return false;
    }

    return true;
  }
}
