import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NPC_TRADER_INTERACTION_DISTANCE } from "@providers/constants/NPCConstants";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ITradeRequestItem, TradingEntity } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterValidation } from "./CharacterValidation";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";
import { CharacterItemSlots } from "./characterItems/CharacterItemSlots";
import { IItem } from "@entities/ModuleInventory/ItemModel";

@provide(CharacterTradingValidation)
export class CharacterTradingValidation {
  constructor(
    private characterValidation: CharacterValidation,
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private characterItemSlots: CharacterItemSlots,
    private characterInventory: CharacterInventory,
    private characterItemInventory: CharacterItemInventory
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

  public validateTransaction(
    character: ICharacter,
    tradingEntityItems: Partial<IItem>[],
    items: ITradeRequestItem[],
    entityType: TradingEntity
  ): boolean {
    if (!tradingEntityItems.length) {
      this.socketMessaging.sendErrorMessageToCharacter(character, `Sorry, this ${entityType} has no items for sale.`);
      return false;
    }
    // validate if all item blueprints are valid
    return this.itemInTradingEntityItems(character, items, tradingEntityItems);
  }

  public validateTransactionWithNPC(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): boolean {
    const hasBasicValidation = this.hasBasicValidation(character, npc, items);
    if (!hasBasicValidation) {
      return false;
    }
    // validate if all item blueprints are valid
    return this.validateTransaction(
      character,
      npc.traderItems as unknown as Partial<IItem>[],
      items,
      TradingEntity.NPC
    );
  }

  public async validateSellTransaction(character: ICharacter, items: ITradeRequestItem[]): Promise<boolean> {
    const inventory = await this.characterInventory.getInventory(character);
    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The character does not have an inventory.");
      return false;
    }

    const charItems = await this.characterItemInventory.getAllItemsFromInventoryNested(character);
    const itemsQty = this.characterItemSlots.getTotalQtyByKey(charItems);

    for (const item of items) {
      const itemBlueprint = itemsBlueprintIndex[item.key];
      const qty = itemsQty.get(item.key);

      if (!itemBlueprint.basePrice) {
        this.socketMessaging.sendErrorMessageToCharacter(character, `Sorry, ${itemBlueprint.name} can not be sold.`);
        return false;
      } else if (!qty || qty < 1 || qty < item.qty) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `Sorry, You can not sell ${item.qty} ${itemBlueprint.name}. You only have ${qty || 0}.`
        );
        return false;
      }
    }

    return true;
  }

  public async validateSellTransactionForNPC(
    character: ICharacter,
    npc: INPC,
    items: ITradeRequestItem[]
  ): Promise<boolean> {
    const hasBasicValidation = this.hasBasicValidation(character, npc, items);
    if (!hasBasicValidation) {
      return false;
    }

    return await this.validateSellTransaction(character, items);
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
    // eslint-disable-next-line no-undef
    const isUnderRange = this.movementHelper.isUnderRange(
      character.x,
      character.y,
      npc.x,
      npc.y,
      NPC_TRADER_INTERACTION_DISTANCE
    );

    if (!isUnderRange) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You are too far away from the trader.");
      return false;
    }

    return true;
  }

  private itemInTradingEntityItems(
    character: ICharacter,
    items: ITradeRequestItem[],
    tradingEntityItems: Partial<IItem>[]
  ): boolean {
    for (const item of items) {
      const traderItem = tradingEntityItems.find((traderItem) => traderItem.key === item.key);

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
      if (!tradingEntityItems.length) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this NPC has no items for sale.");
        return false;
      }
    }
    return true;
  }
}
