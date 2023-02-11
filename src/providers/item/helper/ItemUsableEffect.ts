import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { container } from "@providers/inversify/container";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
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

interface IItemUsableEffectOptions {
  canUseInNonPVPZone?: boolean;
  caster?: ICharacter | INPC;
}

@provide(ItemUsableEffect)
export class ItemUsableEffect {
  public apply(
    target: ICharacter | INPC,
    attr: EffectableAttribute,
    value: number,
    options?: IItemUsableEffectOptions
  ): void {
    const mapNonPVPZone = container.get(MapNonPVPZone);
    const socketMessaging = container.get(SocketMessaging);

    if (options?.canUseInNonPVPZone === false) {
      const isTargetCharacter = target.type === EntityType.Character;
      const isTargetAtNonPVPZone = mapNonPVPZone.isNonPVPZoneAtXY(target.scene, target.x, target.y);

      if (isTargetAtNonPVPZone && isTargetCharacter) {
        socketMessaging.sendErrorMessageToCharacter(
          options?.caster as ICharacter,
          "You can't use this rune in a non-PVP zone!"
        );

        return;
      }
    }

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
