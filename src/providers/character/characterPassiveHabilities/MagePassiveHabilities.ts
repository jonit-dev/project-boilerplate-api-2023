import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { BasicAttribute, CharacterClass, CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterMonitorQueue } from "../CharacterMonitorQueue";

//! Mage = sorcerer & druid
@provide(MagePassiveHabilities)
export class MagePassiveHabilities {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterMonitorQueue: CharacterMonitorQueue,
    private traitGetter: TraitGetter,
    private newRelic: NewRelic,
    private spellCalculator: SpellCalculator
  ) {}

  @TrackNewRelicTransaction()
  public async autoRegenManaHandler(character: ICharacter): Promise<void> {
    const { _id, mana, maxMana } = character;

    if (character.class !== CharacterClass.Sorcerer && character.class !== CharacterClass.Druid) {
      await this.characterMonitorQueue.unwatch("mana-regen", character);
      return;
    }

    try {
      const skills = (await Skill.findById(character.skills)
        .lean({ virtuals: true, defaults: true })
        .cacheQuery({
          cacheKey: `${character?._id}-skills`,
        })) as unknown as ISkill as ISkill;

      const magicLvl = await this.traitGetter.getSkillLevelWithBuffs(skills, BasicAttribute.Magic);

      const manaRegenAmount = Math.max(Math.floor(magicLvl / 3), 4);

      const intervalMs = await this.spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
        max: 30000,
        min: 5000,
        skillAssociation: "reverse",
      });

      await this.characterMonitorQueue.watch(
        "mana-regen",
        character,
        async (character: ICharacter) => {
          await this.newRelic.trackTransaction(
            NewRelicTransactionCategory.Interval,
            "AutoRegenManaHandler",
            async () => {
              try {
                const refreshCharacter = (await Character.findById(_id)
                  .lean()
                  .select("_id mana maxMana")) as ICharacter;

                if (refreshCharacter.mana >= refreshCharacter.maxMana) {
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

                if (updatedCharacter.mana === updatedCharacter.maxMana) {
                  return;
                }

                const payload: ICharacterAttributeChanged = {
                  targetId: updatedCharacter._id,
                  mana: updatedCharacter.mana,
                };

                this.socketMessaging.sendEventToUser(
                  updatedCharacter.channelId!,
                  CharacterSocketEvents.AttributeChanged,
                  payload
                );
              } catch (err) {
                console.error("Error during mana regeneration interval:", err);
                await this.characterMonitorQueue.unwatch("mana-regen", character);
              }
            }
          );
        },
        intervalMs
      );
    } catch (err) {
      console.error(err);
    }
  }
}
