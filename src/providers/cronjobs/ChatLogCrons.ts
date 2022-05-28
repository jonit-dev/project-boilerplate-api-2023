import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import dayjs from "dayjs";
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
        $lt: dayjs(new Date()).subtract(6, "months").toDate(),
      },
    }).deleteMany();
  }
}
