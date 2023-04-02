import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable, NamespaceRedisControl } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterClass, CharacterSocketEvents, ICharacter, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

@provide(BerserkerBloodthirst)
export class BerserkerBloodthirst {
  constructor(private inMemoryHashTable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  public async handleBerserkerAttack(characterId: Types.ObjectId, damage: number): Promise<void> {
    try {
      const character = (await Character.findById(characterId).lean()) as ICharacter;

      if (!character) {
        return;
      }

      const spellActivated = await this.getBerserkerBloodthirstSpell(character._id);

      if (!spellActivated) {
        return;
      }

      await this.applyBerserkerBloodthirst(character._id, damage);
    } catch (error) {
      console.error(`Failed to handle berserker attack: ${error}`);
    }
  }

  private async getBerserkerBloodthirstSpell(characterId: Types.ObjectId): Promise<boolean> {
    const namespace = `${NamespaceRedisControl.CharacterSpell}:${characterId.toString()}`;
    const key = SpellsBlueprint.BerserkerBloodthirst;
    const spell = await this.inMemoryHashTable.get(namespace, key);

    return !!spell;
  }

  private async applyBerserkerBloodthirst(characterId: Types.ObjectId, damage: number): Promise<void> {
    try {
      const berserkerMultiplier = 0.1;
      const character = (await Character.findById(characterId).lean()) as ICharacter;

      if (!character || character.class !== CharacterClass.Berserker) {
        return;
      }

      const healing = Math.min(Math.round(damage * berserkerMultiplier) + character.health, character.maxHealth);

      const updatedCharacter = (await Character.findByIdAndUpdate(
        character._id,
        { health: healing },
        { new: true }
      ).lean()) as ICharacter;

      this.sendEventAttributeChange(updatedCharacter);
    } catch (error) {
      console.error(`Failed to apply berserker bloodthirst: ${error} - ${characterId}`);
    }
  }

  private sendEventAttributeChange(character: ICharacter): void {
    const payload: ICharacterAttributeChanged = {
      targetId: character._id,
      health: character.health,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
  }
}
