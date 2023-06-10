import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(DeleteChatCrons)
export class DeleteChatCrons {
  constructor(private newRelic: NewRelic) {}

  public schedule(): void {
    nodeCron.schedule("* * * * *", async () => {
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "DeleteOldChatLogs", async () => {
        await this.deleteOldMessages();
      });
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
