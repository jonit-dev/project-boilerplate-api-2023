import { IJobPost, JobPost } from "@entities/ModuleJob/JobPostModel";
import { JobPostRepository } from "@repositories/ModuleJob/jobPost/JobPostRepository";
import { provide } from "inversify-binding-decorators";

@provide(ReadJobPostUseCase)
export class ReadJobPostUseCase {
  constructor(private jobPostRepository: JobPostRepository) {}

  public async readOne(id: string, filter: Record<string, unknown>): Promise<IJobPost> {
    return await this.jobPostRepository.readOne(JobPost, { _id: id, ...filter }, ["company"], null);
  }
}
