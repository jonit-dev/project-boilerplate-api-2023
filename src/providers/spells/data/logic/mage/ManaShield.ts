import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { NamespaceRedisControl, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

@provide(ManaShield)
export class ManaShield {
  constructor(private inMemoryHashTable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  public async handleManaShield(character: ICharacter, damage: number): Promise<boolean> {
    try {
      if (!character || character.mana === character.maxMana) {
        return false;
      }

      return await this.applyManaShield(character, damage);
    } catch (error) {
      console.error(`Failed to handle sorcerer mana shieldk: ${error}`);
      return false;
    }
  }

  public async getManaShieldSpell(character: ICharacter): Promise<boolean> {
    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const key = SpellsBlueprint.ManaShield;
    const spell = await this.inMemoryHashTable.get(namespace, key);

    return !!spell;
  }

  private async applyManaShield(character: ICharacter, damage: number): Promise<boolean> {
    try {
      if (typeof damage !== "number" || isNaN(damage)) {
        throw new Error(`Invalid damage value: ${damage}`);
      }

      const newMana = character.mana - damage;
      const newHealth = character.health + (newMana < 0 ? newMana : 0);

      if (newMana <= 0 && newHealth <= 0) {
        return false;
      }

      if (newMana <= 0) {
        const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
        const key = SpellsBlueprint.ManaShield;
        await this.inMemoryHashTable.delete(namespace, key);
      }

      (await Character.findByIdAndUpdate(character._id, {
        mana: newMana > 0 ? newMana : 0,
        health: newMana < 0 ? Math.max(newHealth, 0) : character.health,
      }).lean()) as ICharacter;

      await this.sendEventAttributeChange(character._id);

      return true;
    } catch (error) {
      console.error(`Failed to apply sorcerer mana shield: ${error} - ${character._id}`);
      return false;
    }
  }

  private async sendEventAttributeChange(characterId: Types.ObjectId): Promise<void> {
    const character = (await Character.findById(characterId).select("_id health mana").lean()) as ICharacter;

    const payload: ICharacterAttributeChanged = {
      targetId: character._id,
      health: character.health,
      mana: character.mana,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
  }
}
