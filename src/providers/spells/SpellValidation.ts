import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterClass, CharacterRaces, ISpell } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(SpellValidation)
export class SpellValidation {
  public isAvailableForCharacter(spell: ISpell, character: ICharacter): boolean {
    return this.isAvailableForCharacterClass(spell, character) && this.isAvailableForCharacterRace(spell, character);
  }

  public isAvailableForCharacterClass(spell: ISpell, character: ICharacter): boolean {
    return (
      !spell.characterClass ||
      spell.characterClass.length < 1 ||
      spell.characterClass.indexOf(character.class as CharacterClass) > -1
    );
  }

  public isAvailableForCharacterRace(spell: ISpell, character: ICharacter): boolean {
    return (
      !spell.characterRace ||
      spell.characterRace.length < 1 ||
      spell.characterRace.indexOf(character.race as CharacterRaces) > -1
    );
  }
}
