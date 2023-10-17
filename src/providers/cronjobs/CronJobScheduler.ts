import { NewRelic } from "@providers/analytics/NewRelic";
import { Locker } from "@providers/locks/Locker";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import nodeCron from "node-cron";

@provide(CronJobScheduler)
export class CronJobScheduler {
  constructor(private locker: Locker, private newRelic: NewRelic) {}

  //! Unique in a sense that even if this is scheduled by multiple instances (pm2) or nodes (docker swarm), it will only run in a single instance or node (unique cron job).
  public uniqueSchedule(id: string, cronString: string, task: Function): void {
    nodeCron.schedule(cronString, async () => {
      const canProceed = await this.locker.lock(`cron-job-unique-schedule-${id}`);

      if (!canProceed) {
        return;
      }

      try {
        await this.trackedTask(id, task);
      } catch (error) {
        console.error(`An error occurred while running the task: ${error}`);
      } finally {
        await this.locker.unlock(`cron-job-unique-schedule-${id}`); // Unlock
      }
    });
  }

  //! It will run for how many instances (pm2) or nodes (docker swarm) it is scheduled on.
  public multipleSchedule(id: string, cronString: string, task: Function): void {
    nodeCron.schedule(cronString, async () => {
      try {
        await this.trackedTask(id, task);
      } catch (error) {
        console.error(`An error occurred while running the task: ${error}`);
      }
    });
  }

  private async trackedTask(id: string, task: Function): Promise<void> {
    await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, this.dashToPascalCase(id), async () => {
      await task();
    });
  }

  private dashToPascalCase(str): string {
    return _.join(_.map(_.split(str, "-"), _.capitalize), "");
  }
}
