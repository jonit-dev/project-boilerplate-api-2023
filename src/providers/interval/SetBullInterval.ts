import { appEnv } from "@providers/config/env";
import { locker } from "@providers/inversify/container";
import { Queue, Worker } from "bullmq";

interface IIntervalOptions {
  jobName?: string;
  jobFunc: (data: Record<string, unknown>) => Promise<void> | void;
  interval: number;
  uniqueId: string;
  data: Record<string, unknown>;
}

export class SetBullInterval {
  private redisConfig = {
    connection: {
      host: appEnv.database.REDIS_CONTAINER,
      port: Number(appEnv.database.REDIS_PORT),
    },
  };

  private queue?: Queue;
  private worker?: Worker;
  private readonly queueName: string;
  private readonly jobFunc: (data: Record<string, unknown>) => Promise<void> | void;
  private readonly interval: number;
  private readonly data: Record<string, unknown>;

  constructor(options: IIntervalOptions) {
    const { jobFunc, interval, uniqueId, data } = options;

    this.jobFunc = jobFunc;
    this.interval = interval;
    this.data = data;
    this.queueName = `set-bull-interval-${uniqueId}`;
  }

  public async start(): Promise<void> {
    const canProceed = await locker.lock(this.queueName);

    if (!canProceed) {
      return;
    }

    this.queue = new Queue(this.queueName, this.redisConfig);

    await this.cleanupJobs();

    this.worker = new Worker(
      this.queueName,
      async (job) => {
        try {
          await this.jobFunc(job.data);

          await this.queue!.add(this.queueName, job.data, {
            delay: this.interval,
            removeOnComplete: true,
            removeOnFail: true,
          });
        } catch (error) {
          console.error(error);
          await locker.unlock(this.queueName);
        }
      },
      this.redisConfig
    );

    await this.queue.add(this.queueName, this.data, {
      delay: this.interval,
      removeOnComplete: true,
      removeOnFail: true,
    });

    process.on("SIGTERM", this.gracefulShutdown.bind(this));
    process.on("SIGINT", this.gracefulShutdown.bind(this));
  }

  private async gracefulShutdown(): Promise<void> {
    console.log("Gracefully shutting down...");
    try {
      await this.stop(); // Stop queue and worker
    } catch (error) {
      console.error("An error occurred during graceful shutdown:", error);
    } finally {
      process.exit(0);
    }
  }

  public async stop(): Promise<void> {
    if (!this.queue || !this.worker) {
      throw new Error("Queue or worker not initialized. Did you forget to .start()?");
    }

    await Promise.all([this.queue.close(), this.worker.close()]);
    await locker.unlock(this.queueName);
  }

  private async cleanupJobs(): Promise<void> {
    try {
      const jobs = await this.queue?.getJobs(["active", "waiting", "delayed", "failed", "completed"]);

      if (!jobs) {
        return;
      }

      for (const job of jobs) {
        await job?.remove();
      }
    } catch (error) {
      console.error(error);
    }
  }
}