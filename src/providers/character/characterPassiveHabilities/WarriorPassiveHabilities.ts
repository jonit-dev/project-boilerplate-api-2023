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

@provide(WarriorPassiveHabilities)
export class WarriorPassiveHabilities {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterMonitorQueue: CharacterMonitorQueue,
    private traitGetter: TraitGetter,
    private newRelic: NewRelic,
    private spellCalculator: SpellCalculator
  ) {}

  @TrackNewRelicTransaction()
  public async warriorAutoRegenHealthHandler(character: ICharacter): Promise<void> {
    if (!character) {
      return;
    }

    const { _id, skills, health, maxHealth } = character;

    if (character.class !== CharacterClass.Warrior) {
      await this.characterMonitorQueue.unwatch("health-regen", character);
      return;
    }

    try {
      const charSkills = (await Skill.findById(skills)
        .lean()
        .cacheQuery({
          cacheKey: `${character?._id}-skills`,
        })) as unknown as ISkill;
      const strengthLvl = await this.traitGetter.getSkillLevelWithBuffs(charSkills as ISkill, BasicAttribute.Strength);

      const healthRegenAmount = Math.max(Math.floor(strengthLvl / 3), 4);

      if (health < maxHealth) {
        const intervalMs = await this.spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Strength, {
          min: 5000,
          max: 20000,
          skillAssociation: "reverse",
        });

        await this.characterMonitorQueue.watch(
          "health-regen",
          character,
          async () => {
            await this.newRelic.trackTransaction(
              NewRelicTransactionCategory.Interval,
              "WarriorAutoRegenHealthHandler",
              async () => {
                try {
                  const refreshCharacter = (await Character.findById(_id)
                    .lean()
                    .select("_id health maxHealth")) as ICharacter;

                  if (refreshCharacter.health === refreshCharacter.maxHealth) {
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

                  if (updatedCharacter.health === updatedCharacter.maxHealth) {
                    return;
                  }

                  const payload: ICharacterAttributeChanged = {
                    targetId: updatedCharacter._id,
                    health: updatedCharacter.health,
                  };

                  this.socketMessaging.sendEventToUser(
                    updatedCharacter.channelId!,
                    CharacterSocketEvents.AttributeChanged,
                    payload
                  );
                } catch (err) {
                  console.error("Error during health regeneration interval:", err);
                  await this.characterMonitorQueue.unwatch("health-regen", character);
                }
              }
            );
          },
          intervalMs
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}
