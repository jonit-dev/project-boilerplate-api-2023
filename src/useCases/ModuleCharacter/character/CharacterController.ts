import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { IAuthenticatedRequest } from "@providers/types/ExpressTypes";
import { controller, httpPost, interfaces, request, requestBody } from "inversify-express-utils";
import { CreateCharacterDTO } from "./create/CreateCharacterDTO";
import { CreateCharacterUseCase } from "./create/CreateCharacterUseCase";

@controller("/characters", AuthMiddleware)
export class CharacterController implements interfaces.Controller {
  constructor(private createCharacterUseCase: CreateCharacterUseCase) {}

  @httpPost("/", DTOValidatorMiddleware(CreateCharacterDTO))
  private async createCharacter(
    @requestBody() newCharacter: CreateCharacterDTO,
    @request() request: IAuthenticatedRequest
  ): Promise<ICharacter> {
    const ownerId = request.user.id;

    return await this.createCharacterUseCase.create(newCharacter, ownerId);
  }
}
