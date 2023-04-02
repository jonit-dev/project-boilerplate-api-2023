import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { MacroNetworkCheck } from "./MacroNetworkCheck";
import { MacroNetworkVerify } from "./MacroNetworkVerify";

@provide(MacroNetwork)
export class MacroNetwork {
  constructor(private macroNetworkCheck: MacroNetworkCheck, private macroNetworkVerify: MacroNetworkVerify) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.macroNetworkCheck.onMacroCaptchaCheck(channel);
    this.macroNetworkVerify.onMacroCaptchaVerify(channel);
  }
}
