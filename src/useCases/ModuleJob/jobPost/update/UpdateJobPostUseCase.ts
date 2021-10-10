import { IJobPost, JobPost } from "@entities/ModuleJob/JobPostModel";
import { JobPostRepository } from "@repositories/ModuleJob/jobPost/JobPostRepository";
import { provide } from "inversify-binding-decorators";

import { UpdateJobPostDTO } from "./UpdateJobPostDTO";

@provide(UpdateJobPostUseCase)
export class UpdateJobPostUseCase {
  constructor(private jobPostRepository: JobPostRepository) {}

  public async update(id: string, updateJobPostDTO: UpdateJobPostDTO): Promise<IJobPost> {
    return await this.jobPostRepository.update(JobPost, id, updateJobPostDTO, null);
  }
}
