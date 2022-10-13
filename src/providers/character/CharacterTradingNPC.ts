import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ITradeItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterItemContainer } from "./characterItems/CharacterItemContainer";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterValidation } from "./CharacterValidation";

@provide(CharacterTradingNPC)
export class CharacterTradingNPC {
  constructor(
    private characterValidation: CharacterValidation,
    private movementHelper: MovementHelper,
    private socketMessaging: SocketMessaging,
    private characterTradingBalance: CharacterTradingBalance,
    private characterItemContainer: CharacterItemContainer
  ) {}

  public async buyItemsFromNPC(character: ICharacter, npc: INPC, items: ITradeItem[]): Promise<boolean> {
    const isValid = this.validateBuyTransaction(character, npc, items);

    if (!isValid) {
      return false;
    }

    // if we reached this point, it means the purchase is valid.

    // first, decrement the gold from the character inventory

    // then, add the purchased items to the character inventory

    for (const purchasedItem of items) {
      const itemBlueprint = itemsBlueprintIndex[purchasedItem.key];
      const newItem = new Item({
        ...itemBlueprint,
      });
      await newItem.save();

      await this.characterItemContainer.addItemToContainer(newItem, character, "inventory");
    }

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

    const totalCost = items.reduce((total, item) => {
      return total + item.price;
    }, 0);

    const characterTotalGoldInventory = await this.characterTradingBalance.getTotalGoldInInventory(character);

    if (characterTotalGoldInventory < totalCost) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You don't have enough gold make this purchase.");
      return false;
    }

    return true;
  }
}
