import { IChatLog } from "@entities/ModuleSystem/ChatLogModel";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { Response } from "express";
import { controller, httpGet, interfaces, requestBody } from "inversify-express-utils";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { IAuthenticatedRequest } from "../../../../providers/types/ExpressTypes";
import { ReadChatLogUseCase } from "./ReadChatLogUseCase";
import { ChatLogDTO } from "@useCases/ModuleSystem/chat/ChatLogDTO";

@controller("/chat-log/zone")
export class ReadChatLogController implements interfaces.Controller {
  constructor(private readChatLogUseCase: ReadChatLogUseCase) {}

  @httpGet("/", DTOValidatorMiddleware(ChatLogDTO), AuthMiddleware)
  private async getChatLogInZone(
    @requestBody() chatLogDTO,
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<IChatLog[]> {
    return await this.readChatLogUseCase.getChatLogInZone(chatLogDTO);
  }
}
