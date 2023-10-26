import { RedisManager } from "@providers/database/RedisManager/RedisManager";
import { provide } from "inversify-binding-decorators";
import { CronJobScheduler } from "./CronJobScheduler";

@provide(RedisCrons)
export class RedisCrons {
  constructor(private cronJobScheduler: CronJobScheduler, private redisManager: RedisManager) {}

  public schedule(): void {
    // every 5 minutes
    this.cronJobScheduler.uniqueSchedule("redis-client-connection-count", "* * * * *", async () => {
      await this.redisManager.getClientCount();
    });
  }
}
