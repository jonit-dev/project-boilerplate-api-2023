import { JobPost } from "@entities/ModuleJob/JobPostModel";
import { JobPostRepository } from "@repositories/ModuleJob/jobPost/JobPostRepository";
import { provide } from "inversify-binding-decorators";

@provide(DeleteJobPostUseCase)
export class DeleteJobPostUseCase {
  constructor(private jobPostRepository: JobPostRepository) {}

  public async delete(id: string): Promise<void> {
    await this.jobPostRepository.delete(JobPost, id);
  }
}
