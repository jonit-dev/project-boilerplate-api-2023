import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";

export enum EffectableMaxAttribute {
  Health = "maxHealth",
  Mana = "maxMana",
}

export enum EffectableAttribute {
  Health = "health",
  Mana = "mana",
  Speed = "speed",
}

export class ItemUsableEffect {
  static apply(character: ICharacter | INPC, attr: EffectableAttribute, value: number): void {
    character[attr] += value;
    switch (attr) {
      case EffectableAttribute.Health:
        const maxAttrHealth = EffectableMaxAttribute.Health;
        if (character[attr] > character[maxAttrHealth]) {
          character[attr] = character[maxAttrHealth];
        } else if (character[attr] < 0) {
          character[attr] = 0;
        }
        break;

      case EffectableAttribute.Mana:
        const maxAttrMana = EffectableMaxAttribute.Mana;
        if (character[attr] > character[maxAttrMana]) {
          character[attr] = character[maxAttrMana];
        } else if (character[attr] < 0) {
          character[attr] = 0;
        }
        break;

      case EffectableAttribute.Speed:
        const dataCharacter = character as ICharacter;
        if (dataCharacter.baseSpeed === MovementSpeed.Slow || dataCharacter.baseSpeed === MovementSpeed.ExtraSlow) {
          dataCharacter.baseSpeed = value;
        }
        break;

      default:
        break;
    }
  }

  static applyEatingEffect(character: ICharacter, increase: number): void {
    this.apply(character, EffectableAttribute.Health, increase);
    this.apply(character, EffectableAttribute.Mana, increase);
  }
}
