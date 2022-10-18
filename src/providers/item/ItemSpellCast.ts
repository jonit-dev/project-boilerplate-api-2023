import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "@providers/item/data/index";

@provide(ItemSpellCast)
export class ItemSpellCast {
  public isSpellCasting(msg: string): boolean {
    return !!this.getSpell(msg);
  }

  public castSpell(magicWords: string, character: ICharacter): void {}

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
