import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBan } from "@providers/character/CharacterBan";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(MacroCaptchaCrons)
export class MacroCaptchaCrons {
  constructor(private characterBan: CharacterBan, private socketMessaging: SocketMessaging) {}

  public schedule(): void {
    nodeCron.schedule("*/2 * * * *", async () => {
      await this.banMacroCharacters();
    });
  }

  private async banMacroCharacters(): Promise<void> {
    const now = new Date();

    const charactersWithCaptchaNotVerified = await Character.find({
      captchaVerifyDate: {
        $lt: now,
      },
    });

    if (!charactersWithCaptchaNotVerified.length) return;

    await Character.updateMany(
      {
        captchaVerifyDate: {
          $lt: now,
        },
      },
      {
        captchaVerifyCode: undefined,
        captchaVerifyDate: undefined,
        captchaTriesLeft: undefined,
      }
    ).lean();

    await Promise.all(
      charactersWithCaptchaNotVerified.map(async (character) => {
        await this.characterBan.increasePenaltyAndBan(character, false);
        this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
          reason: "Your character is now banned.",
        });
      })
    );
  }
}
