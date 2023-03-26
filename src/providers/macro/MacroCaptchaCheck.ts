import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { MacroSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import svgCaptcha from "svg-captcha";

@provide(MacroCaptchaCheck)
export class MacroCaptchaCheck {
  constructor(private socketMessaging: SocketMessaging, private characterValidation: CharacterValidation) {}

  public async checkIfCharacterHasCaptchaVerification(character: ICharacter) {
    if (!this.characterValidation.hasBasicValidation(character)) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
    }

    return await this.checkAndSendUserCaptcha(character);
  }

  private async checkAndSendUserCaptcha(character: ICharacter) {
    const fetchedCharacter = await Character.findById(character._id).select("+captchaVerifyCode").lean();

    if (fetchedCharacter?.captchaVerifyCode && fetchedCharacter?.captchaTriesLeft) {
      this.sendCaptchaFromText(character, fetchedCharacter.captchaVerifyCode, fetchedCharacter.captchaTriesLeft);
      return true;
    }

    return false;
  }

  private async sendCaptchaFromText(character: ICharacter, captchaText: string, triesLeft: number) {
    //! Hack, because type package is written wrong on this
    const captcha = (svgCaptcha as any)(captchaText, {
      size: 6,
      noise: 3,
      color: true,
    });

    this.socketMessaging.sendEventToUser(character.channelId!, MacroSocketEvents.OpenMacroModal, {
      svgData: captcha,
      triesLeft,
    });
  }
}
