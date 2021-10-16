import { IJobPost, JobPost } from "@entities/ModuleJob/JobPostModel";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { PlaceHelper } from "@providers/places/PlaceHelper";
import { JobPostRepository } from "@repositories/ModuleJob/jobPost/JobPostRepository";
import { provide } from "inversify-binding-decorators";

import { CreateJobPostDTO } from "./CreateJobPostDTO";

@provide(CreateJobPostUseCase)
export class CreateJobPostUseCase {
  constructor(private jobPostRepository: JobPostRepository, private placeHelper: PlaceHelper) {}

  public async create(createJobPostDTO: CreateJobPostDTO): Promise<IJobPost> {
    const country = this.placeHelper.getCountry(createJobPostDTO.countryCode);

    if (!country) {
      throw new NotFoundError("JobPost country not found.");
    }

    const jobPostData = {
      ...createJobPostDTO,
      country,
    };

    return await this.jobPostRepository.create(JobPost, jobPostData, null, null, null);
  }
}
