import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
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
import { CharacterValidation } from "./CharacterValidation";
import { CharacterWeight } from "./CharacterWeight";

@provide(CharacterTradingNPC)
export class CharacterTradingNPC {
  constructor(
    private characterValidation: CharacterValidation,
    private movementHelper: MovementHelper,
    private socketMessaging: SocketMessaging,
    private characterTradingBalance: CharacterTradingBalance,
    private characterItemContainer: CharacterItemContainer,
    private characterItemInventory: CharacterItemInventory,
    private characterWeight: CharacterWeight
  ) {}

  public async buyItemsFromNPC(character: ICharacter, npc: INPC, items: ITradeItem[]): Promise<boolean> {
    const isValid = await this.validateBuyTransaction(character, npc, items);

    if (!isValid) {
      return false;
    }

    // if we reached this point, it means the purchase is valid. Let's proceed...

    // first, decrement the gold from the character inventory
    const totalCost = this.calculateItemsTotal(items);

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
      // create the new item representation on the database
      const itemBlueprint = itemsBlueprintIndex[purchasedItem.key];
      const newItem = new Item({
        ...itemBlueprint,
      });
      await newItem.save();

      // add it to the character's inventory
      await this.characterItemContainer.addItemToContainer(newItem, character, "inventory");
    }

    // finally, update character's weight
    await this.characterWeight.updateCharacterWeight(character);

    return true;
  }

  public async sellItemsToNPC(character: ICharacter, npc: INPC, items: ITradeItem[]): Promise<void> {}

  private async validateBuyTransaction(character: ICharacter, npc: INPC, items: ITradeItem[]): Promise<boolean> {
    const baseValidation = this.characterValidation.hasBasicValidation(character);

    if (!baseValidation) {
      return false;
    }

    // validate if all item blueprints are valid

    for (const item of items) {
      const itemBlueprint = itemsBlueprintIndex[item.key];

      if (!itemBlueprint) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, one of the items you are trying to buy is not available."
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

    // TODO: Does the character has enough gold to purchase all required items?

    const totalCost = this.calculateItemsTotal(items);

    const characterTotalGoldInventory = await this.characterTradingBalance.getTotalGoldInInventory(character);

    if (characterTotalGoldInventory < totalCost) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You don't have enough gold make this purchase.");
      return false;
    }

    return true;
  }

  private calculateItemsTotal(items: ITradeItem[]): number {
    return items.reduce((total, item) => {
      return total + item.price * item.qty;
    }, 0);
  }
}
