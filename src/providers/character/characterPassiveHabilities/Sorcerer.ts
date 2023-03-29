import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterClass, CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(SorcererPassiveHabilities)
export class SorcererPassiveHabilities {
  constructor(private socketMessaging: SocketMessaging, private inMemoryHashTable: InMemoryHashTable) {}

  public async sorcererAutoRegenManaHandler(
    characterId: Types.ObjectId,
    characterClass: CharacterClass
  ): Promise<void> {
    if (characterClass !== CharacterClass.Sorcerer) {
      return;
    }

    const namespace = `character-buff:${characterId.toString()}`;
    const key = "auto-mana-regen";

    const regenManaIntervalId = await this.inMemoryHashTable.get(namespace, key);

    if (!regenManaIntervalId) {
      const character = (await Character.findById(characterId).lean()) as ICharacter;

      if (character.mana === character.maxMana) {
        return;
      }

      const skills = (await Skill.findById(character.skills).lean()) as ISkill;
      const magicSkill = skills.magic.level;

      let interval = 20000 - magicSkill * 500;
      interval = Math.min(Math.max(interval, 1000), 20000);
      const qtyManaRegen = Math.max(Math.floor(magicSkill / 2), 3);

      const intervalId = setInterval(async () => {
        try {
          if (character.mana < character.maxMana) {
            character.mana = Math.min(character.mana + qtyManaRegen, character.maxMana);

            const updatedCharacter = (await Character.findByIdAndUpdate(characterId, character, {
              new: true,
            }).lean()) as ICharacter;

            const payload: ICharacterAttributeChanged = {
              targetId: updatedCharacter._id,
              mana: updatedCharacter.mana,
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
      await this.inMemoryHashTable.set(namespace, key, `interval: ${interval} manaIncrease: ${qtyManaRegen}`);

      const expireTimeout = Math.floor(((character.maxMana - character.mana) / qtyManaRegen) * (interval / 1000));
      await this.inMemoryHashTable.expire(namespace, expireTimeout, "NX");
    }
  }
}
