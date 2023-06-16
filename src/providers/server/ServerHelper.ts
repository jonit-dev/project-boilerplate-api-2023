import { provide } from "inversify-binding-decorators";
import { appEnv } from "../config/env";
import { ConsoleHelper } from "../console/ConsoleHelper";
import { TS } from "../translation/TranslationHelper";
import { IServerBootstrapVars } from "../types/ServerTypes";
import { database, socketAdapter } from "@providers/inversify/container";
import { Server } from "http";
import { CharacterSocketEvents } from "@rpg-engine/shared";

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

  public gracefullyShutdown(server: Server): void {
    const terminationSignals: { signal: NodeJS.Signals; errno: number }[] = [
      { signal: "SIGINT", errno: 1 },
      { signal: "SIGTERM", errno: 1 },
    ];

    terminationSignals.forEach((termination) => {
      process.on(termination.signal, async () => {
        try {
          console.info(`🛑 ${termination.signal} signal received, gracefully shutting down the server...`);

          socketAdapter.emitToAllUsers(CharacterSocketEvents.CharacterForceDisconnect); //TODO: Use an event name to inform players that they are getting disconnected because the server is restarting

          server.close(() => {
            console.info("✅ Express server closed successfully");

            setTimeout(async () => {
              //to finish all methods running in time
              console.info("🛑 Database connection closing");

              await database.close();

              console.info("✅ Graceful shutdown completed");
              process.exit(128 + termination.errno);
            }, 10000);
          });
        } catch (error) {
          console.error("❌ An error occurred during graceful shutdown:", error);
          process.exit(1);
        }
      });
    });
  }
}
