import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";

export enum EffectableAttribute {
  Health = "health",
  Mana = "mana",
  Stamina = "stamina",
}

export class ItemUsableEffect {
  static apply(character: ICharacter, attr: EffectableAttribute, value: number): void {
    character[attr] += value;
  }
}
