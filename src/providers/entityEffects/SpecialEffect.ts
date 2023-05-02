import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
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

  async getOpacity(target: ICharacter | INPC): Promise<number> {
    if (await this.isInvisible(target)) {
      return 0.3;
    }
    return 1;
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
