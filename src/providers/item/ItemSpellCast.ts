import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterValidation } from "@providers/character/CharacterValidation";

@provide(ItemSpellCast)
export class ItemSpellCast {
  constructor(private socketMessaging: SocketMessaging, private characterValidation: CharacterValidation) {}

  public isSpellCasting(msg: string): boolean {
    return !!this.getSpell(msg);
  }

  public castSpell(magicWords: string, character: ICharacter): boolean {
    if (!this.characterValidation.hasBasicValidation(character)) {
      return false;
    }

    const spell = this.getSpell(magicWords);

    if (!this.isSpellCastingValid(spell, character)) {
      return false;
    }

    return false;
  }

  private isSpellCastingValid(spell, character: ICharacter): boolean {
    if (!spell) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, spell not found.");
      return false;
    }

    if (!character.learnedSpells || character.learnedSpells.indexOf(spell.key) < 0) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you have not learned this spell.");
      return false;
    }

    if (character.mana < spell.manaCost) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you do not have mana to cast this spell.");
      return false;
    }

    return true;
  }

  private getSpell(magicWords: string): any {
    for (const key in itemsBlueprintIndex) {
      const item = itemsBlueprintIndex[key];
      if (item.magicWords === magicWords) {
        return item;
      }
    }
    return null;
  }
}
