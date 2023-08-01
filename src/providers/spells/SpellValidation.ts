import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterClass, ISpell, CharacterRaces } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(SpellValidation)
export class SpellValidation {
  isAvailableForCharacter(spell: ISpell, character: ICharacter): boolean {
    return this.isAvailableForCharacterClass(spell, character) && this.isAvailableForCharacterRace(spell, character);
  }

  isAvailableForCharacterClass(spell: ISpell, character: ICharacter): boolean {
    return (
      !spell.characterClass ||
      spell.characterClass.length < 1 ||
      spell.characterClass.indexOf(character.class as CharacterClass) > -1
    );
  }

  isAvailableForCharacterRace(spell: ISpell, character: ICharacter): boolean {
    return (
      !spell.characterRace ||
      spell.characterRace.length < 1 ||
      spell.characterRace.indexOf(character.race as CharacterRaces) > -1
    );
  }
}
