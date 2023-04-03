import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable, NamespaceRedisControl } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterClass, CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

@provide(BerserkerBloodthirst)
export class BerserkerBloodthirst {
  constructor(private inMemoryHashTable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  public async handleBerserkerAttack(character: ICharacter, damage: number): Promise<void> {
    try {
      if (!character || character.class !== CharacterClass.Berserker || character.health === character.maxHealth) {
        return;
      }

      const spellActivated = await this.getBerserkerBloodthirstSpell(character);

      if (!spellActivated) {
        return;
      }

      await this.applyBerserkerBloodthirst(character, damage);
    } catch (error) {
      console.error(`Failed to handle berserker attack: ${error}`);
    }
  }

  private async getBerserkerBloodthirstSpell(character: ICharacter): Promise<boolean> {
    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id.toString()}`;
    const key = SpellsBlueprint.BerserkerBloodthirst;
    const spell = await this.inMemoryHashTable.get(namespace, key);

    return !!spell;
  }

  private async applyBerserkerBloodthirst(character: ICharacter, damage: number): Promise<void> {
    try {
      const berserkerMultiplier = 0.1;

      const healing = Math.min(
        Math.max(1, Math.round(damage * berserkerMultiplier)) + character.health,
        character.maxHealth
      );

      (await Character.findByIdAndUpdate(character._id, { health: healing }).lean()) as ICharacter;

      await this.sendEventAttributeChange(character._id);
    } catch (error) {
      console.error(`Failed to apply berserker bloodthirst: ${error} - ${character._id}`);
    }
  }

  private async sendEventAttributeChange(characterId: Types.ObjectId): Promise<void> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;
    const payload: ICharacterAttributeChanged = {
      targetId: character._id,
      health: character.health,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
  }
}
