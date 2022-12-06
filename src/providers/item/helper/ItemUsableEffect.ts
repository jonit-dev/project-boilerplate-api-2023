import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";

export enum EffectableMaxAttribute {
  Health = "maxHealth",
  Mana = "maxMana",
}

export enum EffectableAttribute {
  Health = "health",
  Mana = "mana",
}

export class ItemUsableEffect {
  static apply(character: ICharacter | INPC, attr: EffectableAttribute, value: number): void {
    character[attr] += value;

    const maxAttr = EffectableAttribute.Health === attr ? EffectableMaxAttribute.Health : EffectableMaxAttribute.Mana;
    if (character[attr] > character[maxAttr]) {
      character[attr] = character[maxAttr];
    } else if (character[attr] < 0) {
      character[attr] = 0;
    }
  }

  static applyEatingEffect(character: ICharacter, increase: number): void {
    this.apply(character, EffectableAttribute.Health, increase);
    this.apply(character, EffectableAttribute.Mana, increase);
  }
}
