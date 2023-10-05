import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterView } from "@providers/character/CharacterView";
import { InMemoryRepository } from "@providers/database/InMemoryRepository";
import { Locker } from "@providers/locks/Locker";
import { MathHelper } from "@providers/math/MathHelper";
import { GRID_WIDTH } from "@rpg-engine/shared";
import dayjs from "dayjs";
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
    private npcGiantForm: NPCGiantForm,
    private locker: Locker,
    private inMemoryHashTable: InMemoryRepository
  ) {}

  public calculateSpawnTime(strengthLevel: number): Date {
    let spawnTime = Math.round(strengthLevel / 10);
    spawnTime = Math.max(1, spawnTime); // ensure it's at least 1
    spawnTime = Math.min(10, spawnTime); // ensure it's at most 10

    return dayjs(new Date()).add(spawnTime, "minutes").toDate();
  }

  @TrackNewRelicTransaction()
  public async spawn(npc: INPC, isRaid?: boolean): Promise<void> {
    if (!isRaid && !(await this.canSpawn(npc))) {
      return;
    }

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

    await this.locker.unlock(`npc-death-${npc._id}`);
    await this.locker.unlock(`npc-body-generation-${npc._id}`);
    await this.locker.unlock(`npc-${npc._id}-release-xp`);
    await this.locker.unlock(`npc-${npc._id}-npc-cycle`);
    await this.locker.unlock(`npc-${npc._id}-npc-battle-cycle`);

    await this.inMemoryHashTable.delete("npc-force-pathfinding-calculation", npc._id);

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
