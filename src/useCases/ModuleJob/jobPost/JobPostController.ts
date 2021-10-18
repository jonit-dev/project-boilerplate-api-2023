import { IJobPost } from "@entities/ModuleJob/JobPostModel";
import { IPaginationResponse } from "@project-remote-job-board/shared/dist";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  interfaces,
  queryParam,
  requestBody,
  requestParam,
} from "inversify-express-utils";

import { CreateJobPostDTO } from "./create/CreateJobPostDTO";
import { CreateJobPostUseCase } from "./create/CreateJobPostUseCase";
import { DeleteJobPostUseCase } from "./delete/DeleteJobPostUseCase";
import { ReadJobPostUseCase } from "./read/ReadJobPostUseCase";
import { ReadAllJobPostUseCase } from "./readall/ReadAllJobPostUseCase";
import { UpdateJobPostDTO } from "./update/UpdateJobPostDTO";
import { UpdateJobPostUseCase } from "./update/UpdateJobPostUseCase";

@controller("/job-posts")
export class JobPostController implements interfaces.Controller {
  constructor(
    private createJobPostUseCase: CreateJobPostUseCase,
    private readOneJobPostUseCase: ReadJobPostUseCase,
    private readAllJobPostUseCase: ReadAllJobPostUseCase,
    private updateJobPostUseCase: UpdateJobPostUseCase,
    private deleteJobPostUseCase: DeleteJobPostUseCase
  ) {}

  @httpPost("/", DTOValidatorMiddleware(CreateJobPostDTO))
  public async create(@requestBody() createJobPostDTO: CreateJobPostDTO): Promise<IJobPost> {
    return await this.createJobPostUseCase.create(createJobPostDTO);
  }

  @httpGet("/:id")
  public async readOne(@requestParam() params, @queryParam() query): Promise<IJobPost> {
    const { id } = params;
    return await this.readOneJobPostUseCase.readOne(id, query);
  }

  @httpGet("/")
  public async readAll(@queryParam() query): Promise<IPaginationResponse<IJobPost>> {
    return await this.readAllJobPostUseCase.readAll(query);
  }

  @httpPatch("/:id", DTOValidatorMiddleware(UpdateJobPostDTO))
  public async update(@requestParam() params, @requestBody() updateJobPostDTO: UpdateJobPostDTO): Promise<IJobPost> {
    const { id } = params;

    return await this.updateJobPostUseCase.update(id, updateJobPostDTO);
  }

  @httpDelete("/:id")
  public async delete(@requestParam() params): Promise<void> {
    const { id } = params;

    await this.deleteJobPostUseCase.delete(id);
  }
}
