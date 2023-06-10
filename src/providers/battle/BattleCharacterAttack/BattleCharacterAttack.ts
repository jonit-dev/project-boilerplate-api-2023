/* eslint-disable require-await */
/* eslint-disable no-void */
/* eslint-disable no-new */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { appEnv } from "@providers/config/env";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { Queue, Worker } from "bullmq";
import { provide } from "inversify-binding-decorators";
import { BattleAttackTarget } from "../BattleAttackTarget/BattleAttackTarget";
import { BattleCycle } from "../BattleCycle";
import { BattleCharacterAttackValidation } from "./BattleCharacterAttackValidation";

@provide(BattleCharacterAttack)
export class BattleCharacterAttack {
  private queue: Queue;
  private worker: Worker;

  constructor(
    private battleAttackTarget: BattleAttackTarget,
    private battleCharacterAttackValidation: BattleCharacterAttackValidation,
    private socketMessaging: SocketMessaging,
    private newRelic: NewRelic
  ) {
    this.queue = new Queue("BattleCharacterAttack", {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      "BattleCharacterAttack",
      async (job) => {
        try {
          this.newRelic.trackTransaction(NewRelicTransactionCategory.Operation, "CharacterBattleCycle", async () => {
            // get an updated version of the character and target.
            const { characterId, targetId, targetType } = job.data;

            const updatedCharacter = await Character.findOne({ _id: characterId });

            if (!updatedCharacter) {
              throw new Error("Failed to get updated character for attacking target.");
            }

            const characterSkills = await Skill.find({ owner: characterId }).cacheQuery({
              cacheKey: `character-${characterId}-skills`,
              ttl: 86400,
            });

            updatedCharacter.skills = characterSkills;

            let updatedTarget;

            if (targetType === "NPC") {
              updatedTarget = await NPC.findOne({ _id: targetId }).lean({
                virtuals: true,
                defaults: true,
              });

              const updatedNPCSkills = await Skill.findOne({ owner: targetId }).cacheQuery({
                cacheKey: `npc-${targetId}-skills`,
              });

              updatedTarget.skills = updatedNPCSkills;
            }
            if (targetType === "Character") {
              updatedTarget = await Character.findOne({ _id: targetId }).lean({
                virtuals: true,
                defaults: true,
              });

              const updatedCharacterSkills = await Skill.findOne({ owner: targetId }).cacheQuery({
                cacheKey: `character-${targetId}-skills`,
              });

              updatedTarget.skills = updatedCharacterSkills;
            }

            if (!updatedCharacter || !updatedTarget) {
              throw new Error("Failed to get updated required elements for attacking target.");
            }

            await this.attackTarget(updatedCharacter, updatedTarget);
          });
        } catch (error) {
          console.error(error);
        }
      },
      {
        connection: {
          host: appEnv.database.REDIS_CONTAINER,
          port: Number(appEnv.database.REDIS_PORT),
        },
      }
    );

    this.worker.on("failed", (job, err) => {
      console.log(`Job ${job?.id} failed with error ${err.message}`);
    });
  }

  public async onHandleCharacterBattleLoop(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    if (!character.isBattleActive) {
      await Character.updateOne({ _id: character._id }, { $set: { isBattleActive: true } });
    } else {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return;
    }

    new BattleCycle(
      character.id,
      async () => {
        await this.queue.add(
          "BattleCharacterAttack",
          {
            characterId: character.id,
            targetId: target.id,
            targetType: target.type,
          },
          { removeOnComplete: true }
        );
      },
      character.attackIntervalSpeed
    );
  }

  public async attackTarget(character: ICharacter, target: ICharacter | INPC): Promise<boolean> {
    try {
      const canAttack = await this.battleCharacterAttackValidation.canAttack(character, target);

      if (!canAttack) {
        return false;
      }

      if (!character) {
        throw new Error("Failed to find character");
      }

      const checkRangeAndAttack = await this.battleAttackTarget.checkRangeAndAttack(character, target);

      if (checkRangeAndAttack) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
