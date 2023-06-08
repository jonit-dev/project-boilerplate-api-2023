import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(ChatLogCrons)
export class ChatLogCrons {
  constructor(private newRelic: NewRelic) {}

  public schedule(): void {
    nodeCron.schedule("0 0 * * 7", () => {
      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "DeleteOldChatLogs", async () => {
        await this.deleteOldMessages();
      });
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
