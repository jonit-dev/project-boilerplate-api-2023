import { provide } from "inversify-binding-decorators";

import { appEnv } from "../config/env";
import { ConsoleHelper } from "../console/ConsoleHelper";
import { TS } from "../translation/TranslationHelper";
import { IServerBootstrapVars } from "../types/ServerTypes";

@provide(ServerHelper)
export class ServerHelper {
  public showBootstrapMessage(config: IServerBootstrapVars): void {
    const {
      port,
      // appName,
      language,
      timezone,
      adminEmail,
      // phoneLocale,
    } = config;

    const consoleHelper = new ConsoleHelper();

    let terminalColor;
    switch (appEnv.general.ENV) {
      case "Development":
        terminalColor = "YELLOW";
        break;
      case "Production":
        terminalColor = "RED";
        break;
      default:
        terminalColor = "BLUE";
        break;
    }

    consoleHelper.coloredLog(
      `🤖: ${TS.translate("global", "serverRunning", {
        env: appEnv.general.ENV!,
        port: String(port),
        language,
        timezone,
        adminEmail,
      })}`,
      terminalColor
    );
  }

  public async sleep(ms): Promise<void> {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
