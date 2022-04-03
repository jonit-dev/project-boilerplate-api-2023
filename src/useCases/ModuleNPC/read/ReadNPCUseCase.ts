import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NPCRepository } from "@repositories/ModuleNPC/NPCRepository";
import { provide } from "inversify-binding-decorators";

@provide(ReadNPCUseCase)
export class ReadNPCUseCase {
  constructor(private npcRepository: NPCRepository) {}

  public async readOne(npcId: string): Promise<INPC> {
    return await this.npcRepository.readOne(NPC, {
      _id: npcId,
    });
  }
}
