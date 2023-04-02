import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { InMemoryHashTable, NamespaceRedisControl } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { CharacterClass, CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(WarriorPassiveHabilities)
export class WarriorPassiveHabilities {
  constructor(private socketMessaging: SocketMessaging, private inMemoryHashTable: InMemoryHashTable) {}

  public async warriorAutoRegenHealthHandler(
    characterId: Types.ObjectId,
    characterClass: CharacterClass
  ): Promise<void> {
    if (characterClass !== CharacterClass.Warrior) {
      return;
    }

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${characterId.toString()}`;
    const key = SpellsBlueprint.HealthRegenSell;

    const regenHealthIntervalId = await this.inMemoryHashTable.get(namespace, key);
    if (!regenHealthIntervalId) {
      const character = (await Character.findById(characterId).lean()) as ICharacter;

      if (character.health === character.maxHealth) {
        return;
      }

      const skills = (await Skill.findById(character.skills).lean()) as ISkill;
      const strengthSkill = skills.strength.level;

      let interval = 20000 - strengthSkill * 500;
      interval = Math.min(Math.max(interval, 1000), 20000);
      const qtyHealthRegen = Math.max(Math.floor(strengthSkill / 3), 4);

      const intervalId = setInterval(async () => {
        try {
          if (character.health < character.maxHealth) {
            character.health = Math.min(character.health + qtyHealthRegen, character.maxHealth);

            const updatedCharacter = (await Character.findByIdAndUpdate(characterId, character, {
              new: true,
            }).lean()) as ICharacter;

            const payload: ICharacterAttributeChanged = {
              targetId: updatedCharacter._id,
              health: updatedCharacter.health,
            };

            this.socketMessaging.sendEventToUser(
              updatedCharacter.channelId!,
              CharacterSocketEvents.AttributeChanged,
              payload
            );
          } else {
            clearInterval(intervalId);
            await this.inMemoryHashTable.delete(namespace, key);
          }
        } catch (err) {
          console.error(err);
        }
      }, interval);

      await this.inMemoryHashTable.set(namespace, key, `interval: ${interval} qtyHealthRegen: ${qtyHealthRegen}`);

      const expireTimeout = Math.floor(((character.maxHealth - character.health) / qtyHealthRegen) * (interval / 1000));
      await this.inMemoryHashTable.expire(namespace, expireTimeout, "NX");
    }
  }
}
