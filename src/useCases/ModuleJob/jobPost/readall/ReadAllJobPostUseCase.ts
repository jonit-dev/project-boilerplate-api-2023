import { IJobPost, JobPost } from "@entities/ModuleJob/JobPostModel";
import { JobPostRepository } from "@repositories/ModuleJob/jobPost/JobPostRepository";
import { provide } from "inversify-binding-decorators";
import { PaginateResult } from "mongoose";

@provide(ReadAllJobPostUseCase)
export class ReadAllJobPostUseCase {
  constructor(private jobPostRepository: JobPostRepository) {}

  public async readAll(filter: Record<string, unknown>): Promise<PaginateResult<IJobPost>> {
    const offset = Number(filter.offset || 0);
    delete filter.offset;

    const results = await this.jobPostRepository.readAllPaginated<IJobPost>(
      JobPost,
      filter,
      null,
      null,
      true,
      offset,
      null,
      null
    );

    return results;
  }
}
