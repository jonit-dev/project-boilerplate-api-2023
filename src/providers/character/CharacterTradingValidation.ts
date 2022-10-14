import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ITradeItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterValidation } from "./CharacterValidation";

@provide(CharacterTradingValidation)
export class CharacterTradingValidation {
  constructor(
    private characterValidation: CharacterValidation,
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper
  ) {}

  public validateTransaction(character: ICharacter, npc: INPC, items: ITradeItem[]): boolean {
    const baseValidation = this.characterValidation.hasBasicValidation(character);

    if (!baseValidation) {
      return false;
    }

    if (!npc.isTrader) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "This NPC is not a trader.");
      return false;
    }

    if (!npc.traderItems) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "This NPC has no items for sale.");
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

      // make sure NPC has item to be sold
      if (!npc.traderItems.length) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this NPC has no items for sale.");
        return false;
      }
    }

    //  Is the character near the seller NPC?
    const isUnderRange = this.movementHelper.isUnderRange(character.x, character.y, npc.x, npc.y, 2);

    if (!isUnderRange) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You are too far away from the seller.");
      return false;
    }

    return true;
  }
}
