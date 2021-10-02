import { IABTest } from "@entities/ModuleSystem/ABTestModel";
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  interfaces,
  queryParam,
  request,
  requestBody,
  requestParam,
  response,
} from "inversify-express-utils";

import { CreateABTestDTO, UpdateABTestDTO } from "./ABTestDTO";
import { CreateABTestUseCase } from "./create/CreateABTestUseCase";
import { DeleteABTestUseCase } from "./delete/DeleteABTestUseCase";
import { ReadABTestUseCase } from "./read/ReadABTestUseCase";
import { UpdateABTestUseCase } from "./update/UpdateABTestUseCase";

@controller("/ab-tests")
export class ABTestController implements interfaces.Controller {
  constructor(
    private createABTestUseCase: CreateABTestUseCase,
    private readABTestUseCase: ReadABTestUseCase,
    private updateABTestUseCase: UpdateABTestUseCase,
    private deleteABTestUseCase: DeleteABTestUseCase
  ) {}

  @httpPost("/")
  private async create(
    @request() req,
    @response() res,
    @requestBody() createABTestDTO: CreateABTestDTO
  ): Promise<IABTest> {
    return await this.createABTestUseCase.create(createABTestDTO);
  }

  @httpGet("/:id")
  private async read(@request() req, @response() res, @requestParam("id") id: string): Promise<IABTest> {
    return await this.readABTestUseCase.read(id);
  }

  @httpGet("/")
  private async readAll(@request() req, @response() res, @queryParam() query): Promise<IABTest[]> {
    return await this.readABTestUseCase.readAll(query);
  }

  @httpPatch("/:id")
  private async update(
    @request() req,
    @response() res,
    @requestParam("id") id: string,
    @requestBody() updateABTestDTO: UpdateABTestDTO
  ): Promise<IABTest> {
    return await this.updateABTestUseCase.update(id, updateABTestDTO);
  }

  @httpDelete("/:id")
  private async delete(@request() req, @response() res, @requestParam("id") id: string): Promise<void> {
    return await this.deleteABTestUseCase.delete(id);
  }
}
