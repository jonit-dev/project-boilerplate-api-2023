import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityType } from "@rpg-engine/shared";
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
  @TrackNewRelicTransaction()
  public async apply(target: ICharacter | INPC, attr: EffectableAttribute, value: number): Promise<void> {
    target[attr] += value;
    const updateObj: any = {};
    switch (attr) {
      case EffectableAttribute.Health:
        const maxAttrHealth = EffectableMaxAttribute.Health;
        if (target[attr] > target[maxAttrHealth]) {
          target[attr] = target[maxAttrHealth];
        } else if (target[attr] < 0) {
          target[attr] = 0;
        }
        updateObj[attr] = target[attr];
        break;

      case EffectableAttribute.Mana:
        const maxAttrMana = EffectableMaxAttribute.Mana;
        if (target[attr] > target[maxAttrMana]) {
          target[attr] = target[maxAttrMana];
        } else if (target[attr] < 0) {
          target[attr] = 0;
        }
        updateObj[attr] = target[attr];
        break;

      case EffectableAttribute.Speed:
        const dataCharacter = target as ICharacter;
        if (dataCharacter.baseSpeed === MovementSpeed.Slow || dataCharacter.baseSpeed === MovementSpeed.ExtraSlow) {
          dataCharacter.baseSpeed = value;
        }
        // eslint-disable-next-line dot-notation
        updateObj["baseSpeed"] = dataCharacter.baseSpeed;
        break;

      default:
        break;
    }
    try {
      if (target.type === EntityType.Character) {
        await Character.updateOne({ _id: target._id }, { $set: updateObj });
      } else {
        await NPC.updateOne({ _id: target._id }, { $set: updateObj });
      }
    } catch (error) {
      console.error("Failed to update entity:", error);
      throw error;
    }
  }

  @TrackNewRelicTransaction()
  public async applyEatingEffect(character: ICharacter, increase: number): Promise<void> {
    await this.apply(character, EffectableAttribute.Health, increase);
    await this.apply(character, EffectableAttribute.Mana, increase);
  }
}
