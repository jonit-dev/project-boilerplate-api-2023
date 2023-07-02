import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterBan } from "@providers/character/CharacterBan";
import { MacroCaptchaSend } from "@providers/macro/MacroCaptchaSend";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import nodeCron from "node-cron";

@provide(MacroCaptchaCrons)
export class MacroCaptchaCrons {
  constructor(
    private characterBan: CharacterBan,
    private macroCaptchaSend: MacroCaptchaSend,
    private newRelic: NewRelic
  ) {}

  public schedule(): void {
    nodeCron.schedule("*/2 * * * *", async () => {
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "BanMacroCharacters", async () => {
        await this.banMacroCharacters();
      });
    });

    nodeCron.schedule("*/5 * * * *", async () => {
      await this.newRelic.trackTransaction(
        NewRelicTransactionCategory.CronJob,
        "SendMacroCaptchaToActiveCharacters",
        async () => {
          await this.sendMacroCaptchaToActiveCharacters();
        }
      );
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
        isOnline: true,
      },
      {
        captchaVerifyCode: undefined,
        captchaVerifyDate: undefined,
        captchaTriesLeft: undefined,
      }
    ).lean();
    await Character.updateMany(
      {
        captchaVerifyDate: {
          $lt: now,
        },
        isOnline: false,
      },
      {
        captchaVerifyDate: undefined,
        captchaTriesLeft: undefined,
      }
    ).lean();

    await Promise.all(
      charactersWithCaptchaNotVerified.map(async (character) => {
        if (character.isOnline) await this.characterBan.increasePenaltyAndBan(character);
      })
    );
  }

  private async sendMacroCaptchaToActiveCharacters(): Promise<void> {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 1);

    const charactersWithCaptchaNotVerified = await Character.find({
      captchaVerifyCode: undefined,
      updatedAt: {
        $gt: now,
      },
      $or: [
        {
          captchaNoVerifyUntil: undefined,
        },
        {
          captchaNoVerifyUntil: {
            $lt: now,
          },
        },
      ],
      isOnline: true,
    });

    let sentTo = 0;

    await Promise.all(
      charactersWithCaptchaNotVerified.map(async (character) => {
        const n = _.random(0, 100);

        if (n <= 5) {
          await this.macroCaptchaSend.sendAndStartCaptchaVerification(character);
          sentTo++;
        }
      })
    );

    console.log("SENDING ANTI-MACRO CAPTCHA TO", sentTo, "CHARACTERS");
  }
}
