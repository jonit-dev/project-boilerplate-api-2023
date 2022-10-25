import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";

export enum EffectableMaxAttribute {
  Health = "maxHealth",
  Mana = "maxMana",
}

export enum EffectableAttribute {
  Health = "health",
  Mana = "mana",
}

export class ItemUsableEffect {
  static apply(character: ICharacter, attr: EffectableAttribute, value: number): void {
    character[attr] += value;

    const maxAttr = EffectableAttribute.Health === attr ? EffectableMaxAttribute.Health : EffectableMaxAttribute.Mana;
    if (character[attr] > character[maxAttr]) {
      character[attr] = character[maxAttr];
    } else if (character[attr] < 0) {
      character[attr] = 0;
    }
  }
}
