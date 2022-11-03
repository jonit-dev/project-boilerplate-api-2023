import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { ITradeRequestItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

import { CharacterTradingValidation } from "./CharacterTradingValidation";

@provide(CharacterTradingNPCSell)
export class CharacterTradingNPCSell {
  constructor(private characterTradingValidation: CharacterTradingValidation) {}

  public async sellItemsToNPC(character: ICharacter, npc: INPC, items: ITradeRequestItem[]): Promise<boolean> {
    const isValid = await this.characterTradingValidation.validateSellTransaction(character, npc, items);

    if (!isValid) {
      return false;
    }

    return true;
  }
}
