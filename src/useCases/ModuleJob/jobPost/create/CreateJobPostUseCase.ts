import { Company } from "@entities/ModuleJob/CompanyModel";
import { IJobPost as IJobPostEntity, JobPost } from "@entities/ModuleJob/JobPostModel";
import { IJobPost } from "@project-remote-job-board/shared/dist";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { PlaceHelper } from "@providers/places/PlaceHelper";
import { JobPostRepository } from "@repositories/ModuleJob/jobPost/JobPostRepository";
import { provide } from "inversify-binding-decorators";
import { CreateJobPostDTO } from "./CreateJobPostDTO";

@provide(CreateJobPostUseCase)
export class CreateJobPostUseCase {
  constructor(private jobPostRepository: JobPostRepository, private placeHelper: PlaceHelper) {}

  public async create(createJobPostDTO: CreateJobPostDTO): Promise<IJobPostEntity> {
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
    } as unknown as IJobPost;

    jobPostData = await this.createOrAttachCompany(jobPostData);

    return await this.jobPostRepository.create(JobPost, jobPostData, null, null, null);
  }

  private async createOrAttachCompany(jobPostData: IJobPost): Promise<IJobPost> {
    if (!jobPostData.company?.name) {
      delete jobPostData.company;
      return jobPostData;
    }

    const company = await Company.findOne({ name: jobPostData.company.name });

    if (!company) {
      const newCompany = await Company.create(jobPostData.company);
      await newCompany.save();
      jobPostData.company = newCompany._id;
      return jobPostData;
    } else {
      jobPostData.company = company._id;
      return jobPostData;
    }
  }
}
