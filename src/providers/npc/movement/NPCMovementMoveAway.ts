import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { provide } from "inversify-binding-decorators";
import { NPC_CYCLES } from "../NPCCycle";
import { NPCMovement } from "./NPCMovement";
import { NPCTarget } from "./NPCTarget";

@provide(NPCMovementMoveAway)
export class NPCMovementMoveAway {
  constructor(
    private npcMovement: NPCMovement,
    private npcTarget: NPCTarget,
    private movementHelper: MovementHelper,
    private characterRepository: CharacterRepository
  ) {}

  public async startMovementMoveAway(npc: INPC): Promise<void> {
    if (!npc.targetCharacter) return;

    try {
      const targetCharacter = (await this.characterRepository.findById(npc.targetCharacter!.toString(), {
        leanType: "lean",
      })) as ICharacter;

      if (targetCharacter) {
        await this.npcTarget.tryToClearOutOfRangeTargets(npc);

        const targetDirection = this.npcTarget.getTargetDirection(npc, targetCharacter.x, targetCharacter.y);

        const oppositeTargetDirection = this.movementHelper.getOppositeDirection(targetDirection);

        const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, oppositeTargetDirection);

        if (this.movementHelper.isUnderRange(npc.x, npc.y, newX, newY, npc.maxRangeInGridCells!)) {
          await this.npcMovement.moveNPC(npc, npc.x, npc.y, newX, newY, oppositeTargetDirection);
        }
      } else {
        const npcCycle = NPC_CYCLES.get(npc.id);

        if (npcCycle) {
          await npcCycle.clear();
        }

        await this.npcTarget.tryToSetTarget(npc);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
