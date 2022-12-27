import { provide } from "inversify-binding-decorators";
import { CharacterCrons } from "./CharacterCrons";
import { ChatLogCrons } from "./ChatLogCrons";
import { ControlTimeCrons } from "./ControlTimeCrons";
import { ItemCrons } from "./ItemCrons";
import { NPCCrons } from "./NPCCrons";

@provide(Cronjob)
export class Cronjob {
  constructor(
    private characterCron: CharacterCrons,
    private itemCrons: ItemCrons,
    private chatLogCron: ChatLogCrons,
    private npcCron: NPCCrons,
    private controlTimeCron: ControlTimeCrons
  ) {}

  public start(): void {
    this.scheduleCrons();
  }

  private scheduleCrons(): void {
    console.log("🕒 Start cronjob scheduling...");

    this.characterCron.schedule();
    this.itemCrons.schedule();
    this.chatLogCron.schedule();
    this.npcCron.schedule();
    this.controlTimeCron.schedule();
  }
}
