import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { MacroSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MacroCaptchaVerify } from "../MacroCaptchaVerify";

@provide(MacroNetworkVerify)
export class MacroNetworkVerify {
  constructor(private socketAuth: SocketAuth, private macroCaptchaVerify: MacroCaptchaVerify) {}

  public onMacroCaptchaVerify(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      MacroSocketEvents.MacroSendVerification,
      async ({ code }: { code: string }, character) => {
        await this.macroCaptchaVerify.startCaptchaVerification(character, code);
      }
    );
  }
}
