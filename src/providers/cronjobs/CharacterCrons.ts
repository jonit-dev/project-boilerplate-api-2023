import { Character } from "@entities/ModuleSystem/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(CharacterCrons)
export class CharacterCrons {
  constructor(private socketMessaging: SocketMessaging) {}

  public schedule(): void {
    nodeCron.schedule("*/10 * * * *", async () => {
      console.log("Checking inactive players...");
      await this.logoutInactiveCharacters();
    });
  }

  private async logoutInactiveCharacters(): Promise<void> {
    const onlineCharacters = await Character.find({
      isOnline: true,
    });

    for (const character of onlineCharacters) {
      const lastActivity = dayjs(character.updatedAt);
      const now = dayjs();
      const diff = now.diff(lastActivity, "minute");

      if (diff >= 10) {
        console.log(`🚪: Character id ${character.id} has disconnected due to inactivity...`);
        this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
          reason: "You have were disconnected due to inactivity!",
        });
        this.socketMessaging.sendMessageToCloseCharacters(character, CharacterSocketEvents.CharacterLogout, {
          id: character.id,
        });

        character.isOnline = false;
        await character.save();
      }
    }
  }
}
