import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { EntityType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(Execution)
export class Execution {
  constructor(private npcDeath: NPCDeath, private characterDeath: CharacterDeath) {}

  public async handleBerserkerExecution(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    const attacker = character;
    const entityId = target._id;
    const entityType = target.type as EntityType;

    try {
      if (!attacker || !entityId || !entityType) {
        throw new Error("Invalid parameters");
      }

      if (attacker._id.toString() === entityId.toString()) {
        return;
      }

      if (entityType !== EntityType.Character && entityType !== EntityType.NPC) {
        throw new Error("Invalid entityType provided");
      }

      const healthPercent = Math.floor((100 * target.health) / target.maxHealth);

      if (healthPercent <= 30) {
        if (target.type === EntityType.Character) {
          await this.characterDeath.handleCharacterDeath(attacker, target as ICharacter);
        } else {
          await this.npcDeath.handleNPCDeath(target as INPC);
        }
      }
    } catch (error) {
      throw new Error(`Error executing attack: ${error.message}`);
    }
  }
}
