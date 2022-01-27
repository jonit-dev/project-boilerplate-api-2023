import { JobPost } from "@entities/ModuleJob/JobPostModel";
import { provide } from "inversify-binding-decorators";

@provide(ReadCurrenciesUseCase)
export class ReadCurrenciesUseCase {
  public async readAllAvailable(): Promise<string[]> {
    const jobPosts = await JobPost.find({});

    const currenciesSet = new Set<string>();

    for (const job of jobPosts) {
      if (job.currency) {
        currenciesSet.add(job.currency);
      }
    }

    return Array.from(currenciesSet);
  }
}
