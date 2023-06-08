import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { NamespaceRedisControl } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import {
  BasicAttribute,
  CharacterClass,
  CharacterSocketEvents,
  ICharacterAttributeChanged,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterMonitor } from "../CharacterMonitor";

//! Mage = sorcerer & druid
@provide(MagePassiveHabilities)
export class MagePassiveHabilities {
  constructor(
    private socketMessaging: SocketMessaging,
    private inMemoryHashTable: InMemoryHashTable,
    private characterMonitor: CharacterMonitor,
    private spellCalculator: SpellCalculator,
    private traitGetter: TraitGetter,
    private newRelic: NewRelic
  ) {}

  public async autoRegenManaHandler(character: ICharacter): Promise<void> {
    const { _id, skills, mana, maxMana } = character;

    if (character.class !== CharacterClass.Sorcerer && character.class !== CharacterClass.Druid) {
      this.characterMonitor.unwatch(character);
      return;
    }

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id.toString()}`;
    const key = SpellsBlueprint.ManaRegenSpell;

    const rengenManaIsActive = await this.inMemoryHashTable.has(namespace, key);
    if (rengenManaIsActive) {
      return;
    }

    try {
      const skills = (await Skill.findById(character.skills).lean()) as ISkill;

      const magicLvl = await this.traitGetter.getSkillLevelWithBuffs(skills, BasicAttribute.Magic);
      const interval =
        (await this.spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
          max: 30,
          min: 5,
          skillAssociation: "reverse",
        })) * 1000;

      const manaRegenAmount = Math.max(Math.floor(magicLvl / 3), 4);

      if (mana < maxMana) {
        const intervalId = setInterval(() => {
          this.newRelic.trackTransaction(NewRelicTransactionCategory.Interval, "AutoRegenManaHandler", async () => {
            try {
              const refreshCharacter = (await Character.findById(_id).lean().select("_id mana maxMana")) as ICharacter;

              if (refreshCharacter.mana === refreshCharacter.maxMana) {
                clearInterval(intervalId);
                this.characterMonitor.unwatch(character);
                return;
              }

              const updatedCharacter = (await Character.findByIdAndUpdate(
                _id,
                {
                  mana: Math.min(refreshCharacter.mana + manaRegenAmount, refreshCharacter.maxMana),
                },
                {
                  new: true,
                }
              )
                .lean()
                .select("_id mana channelId")) as ICharacter;

              const payload: ICharacterAttributeChanged = {
                targetId: updatedCharacter._id,
                mana: updatedCharacter.mana,
              };

              this.socketMessaging.sendEventToUser(
                updatedCharacter.channelId!,
                CharacterSocketEvents.AttributeChanged,
                payload
              );

              if (updatedCharacter.mana === updatedCharacter.maxMana) {
                clearInterval(intervalId);
                this.characterMonitor.unwatch(character);
                await this.inMemoryHashTable.delete(namespace, key);
                return;
              }
            } catch (err) {
              console.error("Error during mana regeneration interval:", err);
              clearInterval(intervalId);
              this.characterMonitor.unwatch(character);
            }
          });
        }, interval);

        await this.inMemoryHashTable.set(namespace, key, `interval: ${interval} qtyHealthRegen: ${manaRegenAmount}`);
        await this.inMemoryHashTable.expire(namespace, 120, "NX");
      }
    } catch (err) {
      console.error(err);
    }
  }
}
