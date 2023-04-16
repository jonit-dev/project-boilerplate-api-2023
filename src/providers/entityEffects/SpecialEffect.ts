import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { EXECUTION_SPELL_COOLDOWN } from "@providers/character/__tests__/mockConstants/SkillConstants.mock";
import { InMemoryHashTable, NamespaceRedisControl } from "@providers/database/InMemoryHashTable";
import { TimerWrapper } from "@providers/helpers/TimerWrapper";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { CharacterClass, CharacterSocketEvents, EntityType, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

enum SpecialEffectNamespace {
  Stun = "character-special-effect-stun",
  Stealth = "character-special-effect-stealth",
}

@provide(SpecialEffect)
export class SpecialEffect {
  constructor(
    private inMemoryHashTable: InMemoryHashTable,
    private timer: TimerWrapper,
    private npcDeath: NPCDeath,
    private characterDeath: CharacterDeath,
    private socketMessaging: SocketMessaging
  ) {}

  async stun(target: ICharacter | INPC, intervalSec: number): Promise<boolean> {
    return await this.applyEffect(target, intervalSec, SpecialEffectNamespace.Stun);
  }

  async isStun(target: ICharacter | INPC): Promise<boolean> {
    return await this.isEffectApplied(target, SpecialEffectNamespace.Stun);
  }

  async turnInvisible(target: ICharacter, intervalSec: number): Promise<boolean> {
    const applied = await this.applyEffect(target, intervalSec, SpecialEffectNamespace.Stealth);
    if (!applied) {
      return applied;
    }

    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      target,
      CharacterSocketEvents.CharacterRemoveFromView,
      {
        id: target.id,
      }
    );

    return applied;
  }

  async isInvisible(target: ICharacter | INPC): Promise<boolean> {
    return await this.isEffectApplied(target, SpecialEffectNamespace.Stealth);
  }

  async cleanup(): Promise<void> {
    await this.inMemoryHashTable.deleteAll(SpecialEffectNamespace.Stun);
    await this.inMemoryHashTable.deleteAll(SpecialEffectNamespace.Stealth);
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

      const namespace = `${NamespaceRedisControl.CharacterSpell}:${attacker._id}`;
      let key: SpellsBlueprint = SpellsBlueprint.RogueExecution;

      if (attacker.class === CharacterClass.Berserker) {
        key = SpellsBlueprint.BerserkerExecution;
      }

      const isActionExecuted = await this.inMemoryHashTable.get(namespace, key);

      if (isActionExecuted) {
        return;
      }

      const target =
        entityType === EntityType.Character ? await Character.findById(entityId) : await NPC.findById(entityId);
      if (!target) {
        throw new Error(`No ${entityType} found with ${entityId}`);
      }

      const healthPercent = Math.floor((100 * target.health) / target.maxHealth);
      const isCharacterTarget = target instanceof Character;

      if (healthPercent <= 30) {
        if (isCharacterTarget) {
          await this.characterDeath.handleCharacterDeath(attacker, target as ICharacter);
        } else {
          await this.npcDeath.handleNPCDeath(target as INPC);
        }
      }

      await this.inMemoryHashTable.set(namespace, key, true);
      await this.inMemoryHashTable.expire(namespace, EXECUTION_SPELL_COOLDOWN, "NX");
    } catch (error) {
      throw new Error(`Error executing attack: ${error.message}`);
    }
  }

  private async applyEffect(
    target: ICharacter | INPC,
    intervalSec: number,
    namespace: SpecialEffectNamespace
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
}
