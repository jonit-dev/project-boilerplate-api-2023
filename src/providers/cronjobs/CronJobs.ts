import { appEnv } from "@providers/config/env";
import { PM2Helper } from "@providers/server/PM2Helper";
import { EnvType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterCrons } from "./CharacterCrons";
import { ChatLogCrons } from "./ChatLogCrons";
import { CleanupBloodCrons } from "./CleanupBloodCrons";
import { CleanupBodyCrons } from "./CleanupBodyCrons";
import { CleanupEmptyBodyCrons } from "./CleanupEmptyBodies";
import { ControlTimeCrons } from "./ControlTimeCrons";
import { DeleteChatCrons } from "./DeleteChatCrons";
import { ItemDeleteCrons } from "./ItemDeleteCrons";
import { NPCCrons } from "./NPCCrons";

@provide(Cronjob)
export class Cronjob {
  constructor(
    private characterCron: CharacterCrons,
    private chatLogCron: ChatLogCrons,
    private npcCron: NPCCrons,
    private controlTimeCron: ControlTimeCrons,
    private pm2Helper: PM2Helper,
    private itemDeleteCrons: ItemDeleteCrons,
    private deleteChatCrons: DeleteChatCrons,
    private cleanupBloodCrons: CleanupBloodCrons,
    private cleanupBodyCrons: CleanupBodyCrons,
    private cleanupEmptyBodyCrons: CleanupEmptyBodyCrons
  ) {}

  public start(): void {
    this.scheduleCrons();
  }

  private scheduleCrons(): void {
    console.log("🕒 Start cronjob scheduling...");

    switch (appEnv.general.ENV) {
      case EnvType.Development:
        this.characterCron.schedule();
        this.chatLogCron.schedule();
        this.npcCron.schedule();
        this.controlTimeCron.schedule();
        this.itemDeleteCrons.schedule();
        this.deleteChatCrons.schedule();
        this.cleanupBloodCrons.schedule();
        this.cleanupBodyCrons.schedule();
        this.cleanupEmptyBodyCrons.schedule();
        break;
      case EnvType.Staging:
      case EnvType.Production:
        // make sure it only runs in one instance
        if (process.env.pm_id === this.pm2Helper.pickLastCPUInstance()) {
          this.characterCron.schedule();
          this.chatLogCron.schedule();
          this.npcCron.schedule();
          this.controlTimeCron.schedule();
          this.itemDeleteCrons.schedule();
          this.deleteChatCrons.schedule();
          this.cleanupBloodCrons.schedule();
          this.cleanupBodyCrons.schedule();
          this.cleanupEmptyBodyCrons.schedule();
        }
        break;
    }
  }
}
