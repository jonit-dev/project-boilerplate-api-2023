import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { MacroSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MacroCaptchaCheck } from "../MacroCaptchaCheck";

@provide(MacroNetworkCheck)
export class MacroNetworkCheck {
  constructor(private socketAuth: SocketAuth, private macroCaptchaCheck: MacroCaptchaCheck) {}

  public onMacroCaptchaCheck(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, MacroSocketEvents.CheckIfMacroInProgess, async (_, character) => {
      this.macroCaptchaCheck.checkIfCharacterHasCaptchaVerification(character);
    });
  }
}
