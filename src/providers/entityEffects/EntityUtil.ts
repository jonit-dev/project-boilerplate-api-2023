import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { EntityType } from "@rpg-engine/shared";

export class EntityUtil {
  static async getEntity(entityId: string, entityType: EntityType): Promise<ICharacter | INPC | IItem | null> {
    switch (entityType) {
      case EntityType.Character:
        return (await Character.findById(entityId)) as unknown as ICharacter;

      case EntityType.NPC:
        return (await NPC.findById(entityId)) as unknown as INPC;

      case EntityType.Item:
        return (await Item.findById(entityId)) as unknown as IItem;

      default:
        return null;
    }
  }
}
