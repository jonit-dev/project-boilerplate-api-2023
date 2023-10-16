import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { MacroSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import svgCaptcha from "svg-captcha";

@provide(MacroCaptchaSend)
export class MacroCaptchaSend {
  constructor(private socketMessaging: SocketMessaging, private characterValidation: CharacterValidation) {}

  @TrackNewRelicTransaction()
  public async sendAndStartCaptchaVerification(character: ICharacter): Promise<boolean> {
    if (!this.characterValidation.hasBasicValidation(character)) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    if (await this.checkIfUserHasAlreadyVerification(character)) {
      return false;
    }

    return await this.generateAndSendCaptcha(character);
  }

  private async checkIfUserHasAlreadyVerification(character: ICharacter): Promise<boolean> {
    const fetchedCharacter = await Character.findById(character._id).select("+captchaVerifyCode").lean();

    if (fetchedCharacter?.captchaVerifyCode) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Fill out the present captcha!");
      return true;
    }

    return false;
  }

  @TrackNewRelicTransaction()
  public async generateAndSendCaptcha(character: ICharacter): Promise<boolean> {
    const captcha = svgCaptcha.create({
      size: 6,
      noise: 1,
      color: true,
      ignoreChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0Oo1il458pgqs",
    });

    const resolveUntil = new Date(Date.now() + 30 * 60 * 1000);

    await Character.findByIdAndUpdate(character._id, {
      captchaVerifyCode: captcha.text,
      captchaVerifyDate: resolveUntil,
      captchaTriesLeft: 10,
    }).lean();

    this.socketMessaging.sendEventToUser(character.channelId!, MacroSocketEvents.OpenMacroModal, {
      svgData: captcha.data,
      triesLeft: 10,
      resolveUntil,
    });

    return true;
  }
}
