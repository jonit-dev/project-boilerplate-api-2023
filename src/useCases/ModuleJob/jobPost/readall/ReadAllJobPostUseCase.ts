import { IJobPost, JobPost } from "@entities/ModuleJob/JobPostModel";
import { IPaginationResponse } from "@project-remote-job-board/shared/dist";
import { JobPostRepository } from "@repositories/ModuleJob/jobPost/JobPostRepository";
import { provide } from "inversify-binding-decorators";

@provide(ReadAllJobPostUseCase)
export class ReadAllJobPostUseCase {
  constructor(private jobPostRepository: JobPostRepository) {}

  public async readAll(filter: Record<string, unknown>): Promise<IPaginationResponse<IJobPost>> {
    // return await this.jobPostRepository.readAll(JobPost, filter, false, null, true, 20);

    const results = await this.jobPostRepository.readAllPaginated(JobPost, filter, null, null, true);

    return results;
  }
}
