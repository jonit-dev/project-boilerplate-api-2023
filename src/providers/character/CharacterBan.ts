import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";

@provide(CharacterBan)
export class CharacterBan {
  constructor(private socketMessaging: SocketMessaging) {}

  public async addPenalty(character: ICharacter): Promise<void> {
    character.penalty = character.penalty + 1;
    await character.save();

    if (character.penalty % 10 === 0) {
      character.isBanned = true;
      character.isOnline = false;
      character.banRemovalDate = dayjs(new Date()).add(character.penalty, "day").toDate();
      await character.save();

      this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
        reason: "Your character is now banned.",
      });

      if (character.penalty > 30) {
        character.hasPermanentBan = true;
        await character.save();
      }
    }
  }

  public async increasePenaltyAndBan(character: ICharacter, shouldSendEvent: boolean = true): Promise<void> {
    character.penalty = Math.floor(character.penalty / 10) * 10 + 10;

    if (character.penalty % 10 === 0) {
      character.isBanned = true;
      character.isOnline = false;
      character.banRemovalDate = dayjs(new Date()).add(character.penalty, "day").toDate();
      await character.save();

      if (shouldSendEvent)
        this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
          reason: "Your character is now banned.",
        });

      if (character.penalty > 30) {
        character.hasPermanentBan = true;
        await character.save();
      }
    }
  }
}
