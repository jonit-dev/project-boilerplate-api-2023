import { Company } from "@entities/ModuleJob/CompanyModel";
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
    let country;

    if (createJobPostDTO.countryCode) {
      const country = this.placeHelper.getCountry(createJobPostDTO.countryCode);

      if (!country) {
        throw new NotFoundError("JobPost country not found.");
      }
    } else {
      country = createJobPostDTO.country;
    }

    let jobPostData = {
      ...createJobPostDTO,
      country,
    };

    if (createJobPostDTO.company) {
      const company = await Company.create(createJobPostDTO.company);
      await company.save();
      jobPostData = {
        ...jobPostData,
        company: company._id,
      };
    }

    return await this.jobPostRepository.create(JobPost, jobPostData, null, null, null);
  }
}
