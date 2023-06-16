import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { EntityType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(Execution)
export class Execution {
  constructor(
    private npcDeath: NPCDeath,
    private characterDeath: CharacterDeath,
    private socketMessaging: SocketMessaging
  ) {}

  public async handleBerserkerExecution(attacker: ICharacter, target: ICharacter | INPC): Promise<void> {
    const targetId = target._id;
    const targetType = target.type as EntityType;

    try {
      if (!attacker || !targetId || !targetType) {
        throw new Error("Invalid parameters");
      }

      if (attacker._id.toString() === targetId.toString()) {
        return;
      }

      if (targetType !== EntityType.Character && targetType !== EntityType.NPC) {
        throw new Error("Invalid entityType provided");
      }

      const healthPercent = Math.floor((100 * target.health) / target.maxHealth);

      if (healthPercent > 30) {
        this.socketMessaging.sendErrorMessageToCharacter(
          attacker,
          "The target's health is above 30%, you can't execute target."
        );
      } else {
        if (targetType === EntityType.Character) {
          await this.characterDeath.handleCharacterDeath(attacker, target as ICharacter);
        } else if (targetType === EntityType.NPC) {
          await this.npcDeath.handleNPCDeath(target as INPC);
        }
      }
    } catch (error) {
      throw new Error(`Error executing attack: ${error.message}`);
    }
  }
}
