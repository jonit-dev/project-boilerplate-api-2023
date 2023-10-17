import { ChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import { CronJobScheduler } from "./CronJobScheduler";

@provide(DeleteChatCrons)
export class DeleteChatCrons {
  constructor(private newRelic: NewRelic, private cronJobScheduler: CronJobScheduler) {}

  public schedule(): void {
    this.cronJobScheduler.uniqueSchedule("chat-log-cron-delete-old-messages", "0 */6 * * *", async () => {
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
