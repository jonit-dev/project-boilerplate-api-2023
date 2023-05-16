import { provide } from "inversify-binding-decorators";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { Types } from "mongoose";
import { ISpell, NamespaceRedisControl } from "./data/types/SpellsBlueprintTypes";
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { spellsBlueprints } from "./data/blueprints";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";

@provide(SpellCoolDown)
export default class SpellCoolDown {
  constructor(private inMemoryHashtable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  public async haveSpellCooldown(characterId: Types.ObjectId, magicWords: string): Promise<boolean> {
    this.validateArguments(characterId, magicWords);

    const key = this.getNamespaceKey(magicWords);
    const namespace = this.getSpellCooldownNamespace(characterId, magicWords);

    const hasSpellCooldown = await this.inMemoryHashtable.has(namespace, key);

    return hasSpellCooldown;
  }

  public async setSpellCooldown(characterId: Types.ObjectId, magicWords: string, cooldown: number): Promise<boolean> {
    this.validateArguments(characterId, magicWords, cooldown);

    const key = this.getNamespaceKey(magicWords);
    const namespace = this.getSpellCooldownNamespace(characterId, magicWords);

    const hasSpellCooldown = await this.inMemoryHashtable.has(namespace, key);

    if (hasSpellCooldown) {
      return false;
    }

    const timeLeftSecs = await this.getTimeLeft(characterId, magicWords);
    if (timeLeftSecs >= 0) {
      return false;
    }

    try {
      await this.inMemoryHashtable.set(namespace, key, cooldown);
      await this.inMemoryHashtable.expire(namespace, cooldown, "NX");

      return true;
    } catch (error) {
      console.error(`Failed to set cooldown: ${error.message}`);
      return false;
    }
  }

  public async getAllSpellCooldowns(character: ICharacter): Promise<
    {
      spell: string;
      timeLeft: number;
    }[]
  > {
    const namespacePrefix = `${NamespaceRedisControl.CharacterSpellCoolDown}:${character._id.toString()}`;
    const spellsInCooldowns = await this.inMemoryHashtable.getAllKeysWithPrefix(namespacePrefix);

    const promises = spellsInCooldowns.map((namespace) => {
      const spell = this.getSpellFromNamespace(namespace);
      return this.getTimeLeft(character._id, spell).then((timeLeft) => ({ spell, timeLeft }));
    });

    const cooldowns = await Promise.all(promises);

    this.socketMessaging.sendEventToUser(character.channelId!, "SpellCooldownsRead", cooldowns); // TODO: Add this to shared

    return cooldowns;
  }

  private getSpellFromNamespace(namespace: string): string {
    const namespaceParts = namespace.split(":");
    return namespaceParts[namespaceParts.length - 1];
  }

  public async getTimeLeft(characterId: Types.ObjectId, magicWords: string): Promise<number> {
    this.validateArguments(characterId, magicWords);

    const namespace = this.getSpellCooldownNamespace(characterId, magicWords);

    const timeLeftMs = await this.inMemoryHashtable.getExpire(namespace);
    const timeLeftSecs = timeLeftMs >= 0 ? Math.floor(timeLeftMs / 100) / 10 : -1;

    return timeLeftSecs;
  }

  private getSpellCooldownNamespace(characterId: Types.ObjectId, magicWords: string): string {
    this.validateArguments(characterId, magicWords);
    const key = this.getNamespaceKey(magicWords);

    return `${NamespaceRedisControl.CharacterSpellCoolDown}:${characterId.toString()}:${key}`;
  }

  private getNamespaceKey(magicWords: string): string {
    return magicWords.toLocaleLowerCase().replace(/\s+/g, "_");
  }

  private validateArguments(characterId: Types.ObjectId, magicWords: string, cooldown?: number): void {
    if (!(characterId instanceof Types.ObjectId)) {
      throw new Error("Invalid characterId argument");
    }

    if (magicWords.length === 0 || magicWords.length > 100) {
      throw new Error("Invalid magicWords argument");
    }

    if (cooldown && cooldown < 0) {
      throw new Error("Invalid cooldown argument");
    }
  }

  public async clearCooldowns(characterId: Types.ObjectId): Promise<void> {
    const character = (await Character.findById(characterId).lean().select("learnedSpells")) as ICharacter;

    let spells: ISpell[] = [];
    if (character.learnedSpells) {
      spells = this.getSpells(character.learnedSpells as unknown as ISpell[]);
    }

    if (spells.length === 0) {
      return;
    }

    spells.forEach(async (spell) => {
      const namespace = this.getSpellCooldownNamespace(characterId, spell.magicWords);
      const key = this.getNamespaceKey(spell.magicWords);
      const timeLeft = await this.getTimeLeft(characterId, spell.magicWords);

      // We only need to remove timeLeft with -1 because they won't expire
      if (timeLeft === -1) {
        await this.inMemoryHashtable.delete(namespace, key);
      }
    });
  }

  private getSpells(learnedSpells: ISpell[]): ISpell[] {
    const spells: ISpell[] = [];
    for (const key in spellsBlueprints) {
      const spell = spellsBlueprints[key];
      for (let i = 0; i < learnedSpells.length; i++) {
        if (spell.key === learnedSpells[i]) {
          spells.push(spell);
        }
      }
    }
    return spells;
  }
}
