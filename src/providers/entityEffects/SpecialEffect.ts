import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { EXECUTION_SPELL_COOLDOWN } from "@providers/character/__tests__/mockConstants/SkillConstants.mock";
import { InMemoryHashTable, NamespaceRedisControl } from "@providers/database/InMemoryHashTable";
import { TimerWrapper } from "@providers/helpers/TimerWrapper";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { EntityType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

enum SpecialEffectNamespace {
  Stun = "character-special-effect-stun",
}

@provide(SpecialEffect)
export class SpecialEffect {
  constructor(
    private inMemoryHashTable: InMemoryHashTable,
    private timer: TimerWrapper,
    private npcDeath: NPCDeath,
    private characterDeath: CharacterDeath
  ) {}

  async execution(attacker: ICharacter, entityId: Types.ObjectId, entityType: EntityType): Promise<void> {
    try {
      if (!attacker || !entityId || !entityType) {
        throw new Error("Invalid parameters");
      }

      if (attacker._id.toString() === entityId.toString()) {
        return;
      }

      if (entityType !== EntityType.Character && entityType !== EntityType.NPC) {
        throw new Error("Invalid entityType provided");
      }

      const target = await (entityType === EntityType.Character
        ? Character.findById(entityId)
        : NPC.findById(entityId));

      if (!target) {
        throw new Error(`No ${entityType} found with ${entityId}`);
      }

      const namespace = `${NamespaceRedisControl.CharacterSpell}:${attacker._id}`;
      const key = SpellsBlueprint.RogueExecution;
      const isActionExecuted = await this.inMemoryHashTable.get(namespace, key);

      if (isActionExecuted) {
        return;
      }

      const healthPercent = Math.floor((100 * target.health) / target.maxHealth);
      const isCharacterTarget = target instanceof Character;

      if (healthPercent <= 30) {
        if (isCharacterTarget) {
          await this.characterDeath.handleCharacterDeath(attacker, target as ICharacter);
        } else {
          await this.npcDeath.handleNPCDeath(target as INPC);
        }

        await this.inMemoryHashTable.set(namespace, key, true);
        await this.inMemoryHashTable.expire(namespace, EXECUTION_SPELL_COOLDOWN, "NX");
      }
    } catch (error) {
      throw new Error(`Error executing attack: ${error.message}`);
    }
  }

  async stun(entityId: string, entityType: EntityType, intervalSec: number): Promise<boolean> {
    if (entityType === EntityType.Item) {
      return false;
    }

    await this.inMemoryHashTable.set(SpecialEffectNamespace.Stun, this.getEntityKey(entityId, entityType), true);

    this.timer.setTimeout(async () => {
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

  async cleanup(): Promise<void> {
    await this.inMemoryHashTable.deleteAll(SpecialEffectNamespace.Stun);
  }

  private getEntityKey(entityId: string, entityType: EntityType): string {
    const key = [entityType, entityId].join(":");
    return key;
  }
}
