import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { IChatMessage } from "@rpg-engine/shared";
import { Response } from "express";
import { controller, httpGet, interfaces, queryParam } from "inversify-express-utils";
import { IAuthenticatedRequest } from "../../../../providers/types/ExpressTypes";
import { ReadChatLogUseCase } from "./ReadChatLogUseCase";

@controller("/chat-log/zone")
export class ReadChatLogController implements interfaces.Controller {
  constructor(private readChatLogUseCase: ReadChatLogUseCase) {}

  @httpGet("/", AuthMiddleware)
  private async getChatLogInZone(
    @queryParam() chatLogZone,
    req: IAuthenticatedRequest,
    res: Response
  ): Promise<IChatMessage[]> {
    return await this.readChatLogUseCase.getChatLogInZone(chatLogZone);
  }
}
