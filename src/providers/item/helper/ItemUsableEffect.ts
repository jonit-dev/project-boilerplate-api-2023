import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { provide } from "inversify-binding-decorators";

export enum EffectableMaxAttribute {
  Health = "maxHealth",
  Mana = "maxMana",
}

export enum EffectableAttribute {
  Health = "health",
  Mana = "mana",
  Speed = "speed",
}

@provide(ItemUsableEffect)
export class ItemUsableEffect {
  public apply(target: ICharacter | INPC, attr: EffectableAttribute, value: number): void {
    target[attr] += value;
    switch (attr) {
      case EffectableAttribute.Health:
        const maxAttrHealth = EffectableMaxAttribute.Health;
        if (target[attr] > target[maxAttrHealth]) {
          target[attr] = target[maxAttrHealth];
        } else if (target[attr] < 0) {
          target[attr] = 0;
        }
        break;

      case EffectableAttribute.Mana:
        const maxAttrMana = EffectableMaxAttribute.Mana;
        if (target[attr] > target[maxAttrMana]) {
          target[attr] = target[maxAttrMana];
        } else if (target[attr] < 0) {
          target[attr] = 0;
        }
        break;

      case EffectableAttribute.Speed:
        const dataCharacter = target as ICharacter;
        if (dataCharacter.baseSpeed === MovementSpeed.Slow || dataCharacter.baseSpeed === MovementSpeed.ExtraSlow) {
          dataCharacter.baseSpeed = value;
        }
        break;

      default:
        break;
    }
  }

  public applyEatingEffect(character: ICharacter, increase: number): void {
    this.apply(character, EffectableAttribute.Health, increase);
    this.apply(character, EffectableAttribute.Mana, increase);
  }
}
