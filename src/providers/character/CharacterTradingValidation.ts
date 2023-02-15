import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ITradeRequestItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterValidation } from "./CharacterValidation";
import { CharacterItemSlots } from "./characterItems/CharacterItemSlots";

@provide(CharacterTradingValidation)
export class CharacterTradingValidation {
  constructor(
    private characterValidation: CharacterValidation,
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private characterItemSlots: CharacterItemSlots,
    private characterInventory: CharacterInventory
  ) {}

  public async validateAndReturnTraderNPC(npcId: string, character: ICharacter): Promise<INPC | undefined> {
    const npc = await NPC.findOne({
      _id: npcId,
    });

    if (!npc) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, the NPC you're trying to trade with is not available."
      );
      return;
    }

    if (!npc.isTrader) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, the NPC you're trying to trade with is not a trader."
      );
      return;
    }

    return npc;
  }

  public validateTransaction(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): boolean {
    const hasBasicValidation = this.hasBasicValidation(character, npc, items);
    if (!hasBasicValidation) {
      return false;
    }

    if (!npc.traderItems?.length) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this NPC has no items for sale.");
      return false;
    }

    // validate if all item blueprints are valid

    for (const item of items) {
      const traderItem = npc.traderItems?.find((traderItem) => traderItem.key === item.key);

      if (!traderItem) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this NPC is not selling this item.");
        return false;
      }

      const basePrice = itemsBlueprintIndex[item.key]?.basePrice ?? 0;
      // check if the item has price <= 0
      if (basePrice <= 0 || item.qty <= 0) {
        this.socketMessaging.sendErrorMessageToCharacter(character, `Sorry, invalid parameters for ${item.key}.`);
        return false;
      }

      // make sure NPC has item to be sold
      if (!npc.traderItems.length) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this NPC has no items for sale.");
        return false;
      }
    }

    return true;
  }

  public async validateSellTransaction(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): Promise<boolean> {
    const hasBasicValidation = this.hasBasicValidation(character, npc, items);
    if (!hasBasicValidation) {
      return false;
    }

    const inventory = await this.characterInventory.getInventory(character);
    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The character does not have an inventory.");
      return false;
    }

    for (const item of items) {
      const itemBlueprint = itemsBlueprintIndex[item.key];
      const qty = await this.characterItemSlots.getTotalQty(inventoryContainer, item.key);

      if (!itemBlueprint.basePrice) {
        this.socketMessaging.sendErrorMessageToCharacter(character, `Sorry, ${itemBlueprint.name} can not be sold.`);
        return false;
      } else if (qty < 1 || qty < item.qty) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `Sorry, You can not sell ${item.qty} ${itemBlueprint.name}. You only have ${qty}.`
        );
        return false;
      }
    }

    return true;
  }

  private hasBasicValidation(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): boolean {
    const baseValidation = this.characterValidation.hasBasicValidation(character);

    if (!baseValidation) {
      return false;
    }

    if (!npc.isTrader) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "This NPC is not a trader.");
      return false;
    }

    for (const item of items) {
      const itemBlueprint = itemsBlueprintIndex[item.key];

      if (!itemBlueprint) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, one of the items you are trying to trade is not available."
        );
        return false;
      }
    }

    //  Is the character near the seller NPC?
    const isUnderRange = this.movementHelper.isUnderRange(character.x, character.y, npc.x, npc.y, 2);

    if (!isUnderRange) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You are too far away from the trader.");
      return false;
    }

    return true;
  }
}
