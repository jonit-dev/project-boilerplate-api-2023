import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterLastAction } from "@providers/character/CharacterLastAction";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketSessionControl } from "@providers/sockets/SocketSessionControl";
import {
  NewRelicMetricCategory,
  NewRelicSubCategory,
  NewRelicTransactionCategory,
} from "@providers/types/NewRelicTypes";
import { CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";
@provide(CharacterCrons)
export class CharacterCrons {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterLastAction: CharacterLastAction,
    private newRelic: NewRelic,
    private socketSessionControl: SocketSessionControl
  ) {}

  public schedule(): void {
    // every 15 min, check how many players are online
    nodeCron.schedule("*/15 * * * *", async () => {
      const onlineCharactersCount = await Character.countDocuments({
        isOnline: true,
      });

      this.newRelic.trackMetric(
        NewRelicMetricCategory.Count,
        NewRelicSubCategory.Characters,
        "Online",
        onlineCharactersCount
      );
    });

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
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "UnbanCharacters", async () => {
        await this.unbanCharacters();
      });
    });

    // Check for clean skull from character
    nodeCron.schedule("* * * * *", async () => {
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "CleanupSkullCrons", async () => {
        await this.cleanSkullCharacters();
      });
    });
  }

  private async unbanCharacters(): Promise<void> {
    const bannedCharacters = await Character.find({
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
    const onlineCharacters = (await Character.find({
      isOnline: true,
    }).lean()) as ICharacter[];

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

        (await Character.findByIdAndUpdate({ _id: character._id }, { isOnline: false })) as ICharacter;

        await this.socketSessionControl.deleteSession(character);

        await this.characterLastAction.clearLastAction(character._id);

        this.newRelic.trackMetric(
          NewRelicMetricCategory.Count,
          NewRelicSubCategory.Characters,
          "CharacterInactiveLogOut",
          1
        );
      }
    }
  }

  private async cleanSkullCharacters(): Promise<void> {
    const now = new Date();

    const charactersWithSkull = (await Character.find({
      skullExpiredAt: { $lt: now },
      hasSkull: true,
    }).lean()) as ICharacter[];

    if (charactersWithSkull.length === 0) return;

    // Prepare the bulk update operation
    const bulkOps = charactersWithSkull.map((character) => ({
      updateOne: {
        filter: { _id: character._id },
        update: {
          $set: { hasSkull: false },
          $unset: { skullType: "", skullExpiredAt: "" },
        },
      },
    }));

    // Execute the bulk update
    await Character.bulkWrite(bulkOps);

    // Send socket messages
    for (const character of charactersWithSkull) {
      const payload: ICharacterAttributeChanged = {
        targetId: character._id,
        hasSkull: false,
      };

      await this.socketMessaging.sendEventToCharactersAroundCharacter(
        character,
        CharacterSocketEvents.AttributeChanged,
        payload,
        true
      );
      this.socketMessaging.sendMessageToCharacter(character, "Your skull was dismissed!");
    }
  }
}
