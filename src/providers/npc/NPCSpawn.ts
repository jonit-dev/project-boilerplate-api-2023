import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { MathHelper } from "@providers/math/MathHelper";
import { GRID_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCGiantForm } from "./NPCGiantForm";
import { NPCWarn } from "./NPCWarn";
import { NPCTarget } from "./movement/NPCTarget";

@provide(NPCSpawn)
export class NPCSpawn {
  constructor(
    private characterView: CharacterView,
    private mathHelper: MathHelper,
    private npcTarget: NPCTarget,
    private npcWarn: NPCWarn,
    private npcGiantForm: NPCGiantForm
  ) {}

  public async spawn(npc: INPC): Promise<void> {
    const canSpawn = await this.canSpawn(npc);

    if (!canSpawn) {
      return;
    }

    await npc.unlockField("health");

    await this.npcTarget.clearTarget(npc);

    await NPC.updateOne(
      { _id: npc._id },
      {
        $set: {
          health: npc.maxHealth,
          mana: npc.maxMana,
          appliedEntityEffects: [],
          x: npc.initialX,
          y: npc.initialY,
          nextSpawnTime: undefined,
        },
      }
    );

    await this.npcGiantForm.resetNPCToNormalForm(npc);
    await this.npcGiantForm.randomlyTransformNPCIntoGiantForm(npc);

    const nearbyCharacters = await this.characterView.getCharactersAroundXYPosition(npc.x, npc.y, npc.scene);

    for (const nearbyCharacter of nearbyCharacters) {
      await this.npcWarn.warnCharacterAboutNPCsInView(nearbyCharacter, {
        always: true,
      });
    }
  }

  private async canSpawn(npc: INPC): Promise<boolean> {
    // check distance to nearest character. If too close, lets abort the spawn!

    const nearestCharacter = await this.characterView.getNearestCharactersFromXYPoint(
      npc.initialX,
      npc.initialY,
      npc.scene
    );

    if (!nearestCharacter) {
      return true;
    }

    const distanceToNearChar = this.mathHelper.getDistanceBetweenPoints(
      npc.x,
      npc.y,
      nearestCharacter.x,
      nearestCharacter.y
    );

    const distanceInGrid = Math.floor(distanceToNearChar / GRID_WIDTH);

    if (distanceInGrid < 20) {
      return false;
    }

    return true;
  }
}
