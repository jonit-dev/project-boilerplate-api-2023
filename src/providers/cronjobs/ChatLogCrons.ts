import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(ChatLogCrons)
export class ChatLogCrons {
  public schedule(): void {
    nodeCron.schedule("0 0 * * 7", async () => {
      console.log("Checking chat logs older than six months...");
      await this.deleteOldMessages();
    });
  }

  private async deleteOldMessages(): Promise<void> {
    await ChatLog.find({
      createdAt: {
        $lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6),
      },
    }).deleteMany();
  }
}
