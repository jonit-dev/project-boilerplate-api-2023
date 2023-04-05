import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { MathHelper } from "@providers/math/MathHelper";
import { GRID_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCWarn } from "./NPCWarn";
import { NPCTarget } from "./movement/NPCTarget";
import { NPCGiantForm } from "./NPCGiantForm";

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

    npc.health = npc.maxHealth;
    npc.mana = npc.maxMana;
    npc.appliedEntityEffects = [];
    await this.npcTarget.clearTarget(npc);
    npc.x = npc.initialX;
    npc.y = npc.initialY;
    await npc.save();

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
