import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { MathHelper } from "@providers/math/MathHelper";
import { GRID_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCManager } from "./NPCManager";
import { NPCView } from "./NPCView";

@provide(NPCSpawn)
export class NPCSpawn {
  constructor(
    private npcManager: NPCManager,
    private npcView: NPCView,
    private characterView: CharacterView,
    private mathHelper: MathHelper
  ) {}

  public async spawn(npc: INPC): Promise<void> {
    const canSpawn = await this.canSpawn(npc);

    if (!canSpawn) {
      console.log(`💀 NPC ${npc.name} is too close to another character and will not be spawned`);
      return;
    }

    npc.health = npc.maxHealth;
    npc.mana = npc.maxMana;
    npc.targetCharacter = undefined;
    npc.x = npc.initialX;
    npc.y = npc.initialY;
    await npc.save();

    // re add behavior loop

    this.npcManager.startBehaviorLoop(npc);

    const nearbyCharacters = await this.characterView.getCharactersAroundXYPosition(npc.x, npc.y, npc.scene);

    for (const nearbyCharacter of nearbyCharacters) {
      await this.npcView.warnCharacterAboutNPCsInView(nearbyCharacter);
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
