import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { MacroSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MacroCaptchaSend } from "../MacroCaptchaSend";

@provide(MacroNetworkTrigger)
export class MacroNetworkTrigger {
  constructor(private socketAuth: SocketAuth, private macroCaptchaSend: MacroCaptchaSend) {}

  public onMacroTrigger(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, MacroSocketEvents.TriggerMacro, async (_, character) => {
      console.log("MACRO DETECTED", character._id);

      this.macroCaptchaSend.sendAndStartCaptchaVerification(character);
    });
  }
}
