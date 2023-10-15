import { appEnv } from "@providers/config/env";
import { locker } from "@providers/inversify/container";
import { Queue, Worker } from "bullmq";

interface IIntervalOptions {
  jobName?: string;
  jobFunc: (data: any) => Promise<void> | void;
  interval: number;
  uniqueId: string;
  data: any;
}

export class SetBullInterval {
  private redisConfig = {
    connection: {
      host: appEnv.database.REDIS_CONTAINER,
      port: Number(appEnv.database.REDIS_PORT),
    },
  };

  private queue: Queue;
  private worker: Worker;
  private queueName: string;
  private uniqueId: string;
  private jobFunc: (data: any) => Promise<void> | void;
  private interval: number;
  private data: any;

  constructor(options: IIntervalOptions) {
    const { jobFunc, interval, uniqueId, data } = options;

    this.jobFunc = jobFunc;
    this.interval = interval;
    this.uniqueId = uniqueId;
    this.data = data;
  }

  public async start(): Promise<void> {
    this.queueName = `set-bull-interval-${this.uniqueId}`;

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

          await this.queue.add(this.queueName, job.data, {
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
  }

  public async stop(): Promise<void> {
    if (!this.queue || !this.worker) {
      throw new Error("Queue or worker not initialized. Did you forget to .start()?");
    }

    // stop queue and worker
    await Promise.all([this.queue?.close(), this.worker?.close()]);

    await locker.unlock(this.queueName);
  }

  private async cleanupJobs(): Promise<void> {
    try {
      const jobs = await this.queue.getJobs(["active", "waiting", "delayed", "failed", "completed"]);

      for (const job of jobs) {
        await job?.remove();
      }
    } catch (error) {
      console.error(error);
    }
  }
}
