import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NamespaceRedisControl, SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { CharacterClass, CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterMonitor } from "../CharacterMonitor";

@provide(WarriorPassiveHabilities)
export class WarriorPassiveHabilities {
  constructor(
    private socketMessaging: SocketMessaging,
    private inMemoryHashTable: InMemoryHashTable,
    private characterMonitor: CharacterMonitor
  ) {}

  public async warriorAutoRegenHealthHandler(character: ICharacter): Promise<void> {
    const { _id, skills, health, maxHealth } = character;

    if (character.class !== CharacterClass.Warrior) {
      this.characterMonitor.unwatch(character);
      return;
    }

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${_id.toString()}`;
    const key = SpellsBlueprint.HealthRegenSell;

    const regenHealthIsActive = await this.inMemoryHashTable.has(namespace, key);
    if (regenHealthIsActive) {
      return;
    }

    try {
      const { strength } = (await Skill.findById(skills).lean().select("strength")) as ISkill;
      const strengthLvl = strength.level;
      const interval = Math.min(Math.max(20000 - strengthLvl * 500, 1000), 20000);
      const healthRegenAmount = Math.max(Math.floor(strengthLvl / 3), 4);

      if (health < maxHealth) {
        const intervalId = setInterval(async () => {
          try {
            const refreshCharacter = (await Character.findById(_id)
              .lean()
              .select("_id health maxHealth")) as ICharacter;

            if (refreshCharacter.health === refreshCharacter.maxHealth) {
              clearInterval(intervalId);
              await this.inMemoryHashTable.delete(namespace, key);
              this.characterMonitor.unwatch(character);
              return;
            }

            const updatedCharacter = (await Character.findByIdAndUpdate(
              _id,
              {
                health: Math.min(refreshCharacter.health + healthRegenAmount, refreshCharacter.maxHealth),
              },
              {
                new: true,
              }
            )
              .lean()
              .select("_id health channelId")) as ICharacter;

            const payload: ICharacterAttributeChanged = {
              targetId: updatedCharacter._id,
              health: updatedCharacter.health,
            };

            this.socketMessaging.sendEventToUser(
              updatedCharacter.channelId!,
              CharacterSocketEvents.AttributeChanged,
              payload
            );

            if (updatedCharacter.health === updatedCharacter.maxHealth) {
              clearInterval(intervalId);
              this.characterMonitor.unwatch(character);
              await this.inMemoryHashTable.delete(namespace, key);
              return;
            }
          } catch (err) {
            console.error("Error during health regeneration interval:", err);
            clearInterval(intervalId);
            this.characterMonitor.unwatch(character);
          }
        }, interval);

        await this.inMemoryHashTable.set(namespace, key, `interval: ${interval} qtyHealthRegen: ${healthRegenAmount}`);
        await this.inMemoryHashTable.expire(namespace, 120, "NX");
      }
    } catch (err) {
      console.error(err);
    }
  }
}
