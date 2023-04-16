import { ICharacter, Character } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { InMemoryHashTable, NamespaceRedisControl } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { provide } from "inversify-binding-decorators";
import { TimerWrapper } from "@providers/helpers/TimerWrapper";
import { CharacterSocketEvents, EntityType, ICharacterAttributeChanged } from "@rpg-engine/shared";

enum SpecialEffectNamespace {
  Stun = "character-special-effect-stun",
  Stealth = "character-special-effect-stealth",
  Execution = "character-special-effect-execution",
}

@provide(SpecialEffect)
export class SpecialEffect {
  constructor(
    private inMemoryHashTable: InMemoryHashTable,
    private timer: TimerWrapper,
    private socketMessaging: SocketMessaging
  ) {}

  async stun(target: ICharacter | INPC, intervalSec: number): Promise<boolean> {
    return await this.applyEffect(target, intervalSec, SpecialEffectNamespace.Stun);
  }

  async isStun(target: ICharacter | INPC): Promise<boolean> {
    return await this.isEffectApplied(target, SpecialEffectNamespace.Stun);
  }

  async turnInvisible(target: ICharacter, intervalSec: number): Promise<boolean> {
    const applied = await this.applyEffect(target, intervalSec, SpecialEffectNamespace.Stealth, async () => {
      await this.sendOpacityChange(target);
    });

    if (!applied) {
      return applied;
    }

    await this.sendOpacityChange(target);

    return applied;
  }

  async isInvisible(target: ICharacter | INPC): Promise<boolean> {
    return await this.isEffectApplied(target, SpecialEffectNamespace.Stealth);
  }

  async cleanup(): Promise<void> {
    await this.inMemoryHashTable.deleteAll(SpecialEffectNamespace.Stun);
    await this.inMemoryHashTable.deleteAll(SpecialEffectNamespace.Stealth);
  }

  async turnOnExecution(target: ICharacter | INPC, intervalSec: number): Promise<boolean> {
    return await this.applyEffect(target, intervalSec, SpecialEffectNamespace.Execution);
  }

  async isExecutionOn(target: ICharacter | INPC): Promise<boolean> {
    return await this.isEffectApplied(target, SpecialEffectNamespace.Execution);
  }

  async getOpacity(target: ICharacter | INPC): Promise<number> {
    if (await this.isInvisible(target)) {
      return 0.3;
    }
    return 1;
  }

  async shapeShift(character: ICharacter, textureKey: string, internvalInSecs: number): Promise<void> {
    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const key: SpellsBlueprint = SpellsBlueprint.DruidShapeshift;

    const normalTextureKey = character.textureKey;
    await this.inMemoryHashTable.set(namespace, key, normalTextureKey);

    const updatedCharacter = (await Character.findByIdAndUpdate(
      character._id,
      {
        textureKey,
      },
      {
        new: true,
      }
    ).select("_id textureKey channelId")) as ICharacter;

    const payload: ICharacterAttributeChanged = {
      targetId: updatedCharacter._id,
      textureKey: updatedCharacter.textureKey,
    };

    this.socketMessaging.sendEventToUser(updatedCharacter.channelId!, CharacterSocketEvents.AttributeChanged, payload);

    setTimeout(async () => {
      const normalTextureKey = await this.inMemoryHashTable.get(namespace, key);

      if (normalTextureKey) {
        const character = (await Character.findByIdAndUpdate(
          updatedCharacter._id,
          {
            textureKey: normalTextureKey.toString(),
          },
          {
            new: true,
          }
        ).select("_id textureKey channelId")) as ICharacter;

        const payload: ICharacterAttributeChanged = {
          targetId: character._id,
          textureKey: character.textureKey,
        };

        await this.inMemoryHashTable.delete(namespace, key);
        this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
      }
    }, internvalInSecs * 1000);
  }

  async clearEffects(target: ICharacter | INPC): Promise<void> {
    if (!target) {
      return;
    }

    await this.inMemoryHashTable.delete(SpecialEffectNamespace.Stealth, this.getEntityKey(target));
  }

  private async applyEffect(
    target: ICharacter | INPC,
    intervalSec: number,
    namespace: SpecialEffectNamespace,
    onEffectEnd?: Function
  ): Promise<boolean> {
    const entityType = target.type as EntityType;
    if (entityType === EntityType.Item) {
      return false;
    }

    const isApplied = await this.isEffectApplied(target, namespace);
    if (isApplied) {
      return false;
    }

    await this.inMemoryHashTable.set(namespace, this.getEntityKey(target), true);

    this.timer.setTimeout(async () => {
      await this.inMemoryHashTable.delete(namespace, this.getEntityKey(target));
      onEffectEnd && onEffectEnd();
    }, intervalSec * 1000);

    return true;
  }

  private async isEffectApplied(target: ICharacter | INPC, namespace: SpecialEffectNamespace): Promise<boolean> {
    const value = await this.inMemoryHashTable.get(namespace, this.getEntityKey(target));
    return !!value;
  }

  private getEntityKey(target: ICharacter | INPC): string {
    const entityType = target.type as EntityType;
    const entityId = target._id;

    const key = [entityType, entityId].join(":");
    return key;
  }

  private async sendOpacityChange(target: ICharacter): Promise<void> {
    const opacity = await this.getOpacity(target);
    const payload = {
      alpha: opacity,
      targetId: target._id,
    };

    this.socketMessaging.sendEventToUser<ICharacterAttributeChanged>(
      target.channelId!,
      CharacterSocketEvents.AttributeChanged,
      payload
    );

    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      target,
      CharacterSocketEvents.AttributeChanged,
      payload
    );
  }
}
