import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(DeleteChatCrons)
export class DeleteChatCrons {
  public schedule(): void {
    nodeCron.schedule("* * * * *", async () => {
      await this.deleteOldMessages();
    });
  }

  private async deleteOldMessages(): Promise<void> {
    await ChatLog.deleteMany({
      createdAt: {
        $lt: dayjs(new Date()).subtract(1, "hour").toDate(),
      },
    });
  }
}
