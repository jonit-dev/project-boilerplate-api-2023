import { Locker } from "@providers/locks/Locker";
import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

@provide(CronJobScheduler)
export class CronJobScheduler {
  constructor(private locker: Locker) {}

  public uniqueSchedule(id: string, cronString: string, task: Function): void {
    const scheduledTask = nodeCron.schedule(cronString, async () => {
      const canProceed = await this.locker.lock(`cron-job-unique-schedule-${id}`);

      if (!canProceed) {
        return;
      }

      try {
        await task();
      } catch (error) {
        console.error(`An error occurred while running the task: ${error}`);
      } finally {
        scheduledTask.destroy(); // Destroy the cron job after execution.
        await this.locker.unlock(`cron-job-unique-schedule-${id}`); // Unlock
      }
    });
  }
}
