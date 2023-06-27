import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterLastAction } from "@providers/character/CharacterLastAction";
import { EntityPosition } from "@providers/entity/EntityPosition";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketSessionControl } from "@providers/sockets/SocketSessionControl";
import { NewRelicMetricCategory, NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { CharacterSocketEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";
@provide(CharacterCrons)
export class CharacterCrons {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterLastAction: CharacterLastAction,
    private newRelic: NewRelic,
    private socketSessionControl: SocketSessionControl,
    private characterRepository: CharacterRepository,
    private entityPosition: EntityPosition
  ) {}

  public schedule(): void {
    nodeCron.schedule("* * * * *", async () => {
      await this.newRelic.trackTransaction(
        NewRelicTransactionCategory.CronJob,
        "LogoutInactiveCharacters",
        async () => {
          await this.logoutInactiveCharacters();
        }
      );
    });

    // check banned characters every day
    nodeCron.schedule("0 0 * * *", async () => {
      await this.newRelic.trackTransaction(
        NewRelicTransactionCategory.CronJob,
        "LogoutInactiveCharacters",
        async () => {
          await this.unbanCharacters();
        }
      );
    });

    // every hour, sync all character positions
    nodeCron.schedule("0 * * * *", async () => {
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "SyncCharacterPositions", async () => {
        await this.entityPosition.syncAllEntityPositions();
      });
    });
  }

  private async unbanCharacters(): Promise<void> {
    const bannedCharacters = await this.characterRepository.find({
      isBanned: true,
      hasPermanentBan: {
        $ne: true,
      },
      banRemovalDate: {
        $lte: new Date(),
      },
    });

    for (const bannedCharacter of bannedCharacters) {
      console.log(`💡 Character id ${bannedCharacter.id} has been unbanned...`);
      bannedCharacter.isBanned = false;
      await bannedCharacter.save();
    }
  }

  private async logoutInactiveCharacters(): Promise<void> {
    const onlineCharacters = await this.characterRepository.find({
      isOnline: true,
    });

    this.newRelic.trackMetric(NewRelicMetricCategory.Count, "Characters/Online", onlineCharacters.length);

    for (const character of onlineCharacters) {
      const dateString = await this.characterLastAction.getLastAction(character._id);

      let date = dayjs(dateString).toDate();

      if (date === undefined) {
        date = character.updatedAt;
      }

      const lastActivity = dayjs(date);

      const now = dayjs();

      const diff = now.diff(lastActivity, "minute");

      if (diff >= 10) {
        console.log(`🚪: Character id ${character.id} has disconnected due to inactivity...`);
        this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
          reason: "You have were disconnected due to inactivity!",
        });
        await this.socketMessaging.sendEventToCharactersAroundCharacter(
          character,
          CharacterSocketEvents.CharacterLogout,
          {
            id: character.id,
          }
        );

        (await this.characterRepository.findByIdAndUpdate(character._id, { isOnline: false })) as ICharacter;

        await this.socketSessionControl.deleteSession(character);

        await this.characterLastAction.clearLastAction(character._id);
      }
    }
  }
}
