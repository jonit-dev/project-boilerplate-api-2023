import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { IAuthenticatedRequest } from "@providers/types/ExpressTypes";
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  interfaces,
  request,
  requestBody,
  requestParam,
} from "inversify-express-utils";
import { CreateCharacterDTO } from "./create/CreateCharacterDTO";
import { CreateCharacterUseCase } from "./create/CreateCharacterUseCase";
import { DeleteCharacterUseCase } from "./delete/DeleteCharacterUseCase";
import { ReadCharacterUseCase } from "./read/ReadCharacterUseCase";
import { UpdateCharacterDTO } from "./update/UpdateCharacterDTO";
import { UpdateCharacterUseCase } from "./update/UpdateCharacterUseCase";

@controller("/characters", AuthMiddleware)
export class CharacterController implements interfaces.Controller {
  constructor(
    private createCharacterUseCase: CreateCharacterUseCase,
    private readCharacterUseCase: ReadCharacterUseCase,
    private updateCharacterUseCase: UpdateCharacterUseCase,
    private deleteCharacterUseCase: DeleteCharacterUseCase
  ) {}

  @httpPost("/", DTOValidatorMiddleware(CreateCharacterDTO))
  private async createCharacter(
    @requestBody() newCharacter: CreateCharacterDTO,
    @request() request: IAuthenticatedRequest
  ): Promise<ICharacter> {
    const ownerId = request.user.id;

    return await this.createCharacterUseCase.create(newCharacter, ownerId);
  }

  @httpGet("/")
  private async readAllCharacters(@request() req): Promise<ICharacter[]> {
    const ownerId = req.user.id;

    return await this.readCharacterUseCase.readAll(ownerId);
  }

  @httpGet("/:id")
  private async readCharacter(@requestParam("id") id: string): Promise<ICharacter> {
    return await this.readCharacterUseCase.read(id);
  }

  @httpPatch("/:id", DTOValidatorMiddleware(UpdateCharacterDTO))
  private async updateCharacter(
    @requestParam("id") id: string,
    @requestBody() updateCharacter: UpdateCharacterDTO,
    @request() request: IAuthenticatedRequest
  ): Promise<ICharacter> {
    const ownerId = request.user.id;

    return await this.updateCharacterUseCase.updateCharacter(id, updateCharacter, ownerId);
  }

  @httpDelete("/:id")
  private async deleteCharacter(
    @requestParam("id") id: string,
    @request() request: IAuthenticatedRequest
  ): Promise<void> {
    const ownerId = request.user.id;

    return await this.deleteCharacterUseCase.delete(id, ownerId);
  }
}
