import { INPC } from "@entities/ModuleNPC/NPCModel";
import { cache } from "@providers/constants/CacheConstants";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { controller, httpGet, interfaces, requestParam } from "inversify-express-utils";
import { ReadNPCUseCase } from "./read/ReadNPCUseCase";

@controller("/npcs", AuthMiddleware)
export class NPCController implements interfaces.Controller {
  constructor(private readNPCUseCase: ReadNPCUseCase) {}

  @httpGet("/:id", cache("24 hours"))
  private async readNPC(@requestParam("id") npcId): Promise<INPC> {
    return await this.readNPCUseCase.readOne(npcId);
  }
}
