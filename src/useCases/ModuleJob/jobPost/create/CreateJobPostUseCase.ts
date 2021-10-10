import { IJobPost, JobPost } from "@entities/ModuleJob/JobPostModel";
import { JobPostRepository } from "@repositories/ModuleJob/jobPost/JobPostRepository";
import { provide } from "inversify-binding-decorators";

import { CreateJobPostDTO } from "./CreateJobPostDTO";

@provide(CreateJobPostUseCase)
export class CreateJobPostUseCase {
  constructor(private jobPostRepository: JobPostRepository) {}

  public async create(createJobPostDTO: CreateJobPostDTO): Promise<IJobPost> {
    return await this.jobPostRepository.create(JobPost, createJobPostDTO, null, null, null);
  }
}
