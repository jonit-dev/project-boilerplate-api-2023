import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { EntityType } from "@rpg-engine/shared";

enum SpecialEffectNamespace {
  Stun = "character-special-effect-stun",
}

@provide(SpecialEffect)
export class SpecialEffect {
  constructor(private inMemoryHashTable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  async stun(entityId: string, entityType: EntityType, intervalSec: number): Promise<boolean> {
    if (entityType === EntityType.Item) {
      return false;
    }

    await this.inMemoryHashTable.set(SpecialEffectNamespace.Stun, this.getEntityKey(entityId, entityType), true);

    setTimeout(async () => {
      await this.inMemoryHashTable.delete(SpecialEffectNamespace.Stun, this.getEntityKey(entityId, entityType));
    }, intervalSec * 1000);

    return true;
  }

  async isStun(entityId: string, entityType: EntityType): Promise<boolean> {
    const value = await this.inMemoryHashTable.get(
      SpecialEffectNamespace.Stun,
      this.getEntityKey(entityId, entityType)
    );
    return !!value;
  }

  private getEntityKey(entityId: string, entityType: EntityType): string {
    const key = [entityType, entityId].join(":");
    return key;
  }
}
