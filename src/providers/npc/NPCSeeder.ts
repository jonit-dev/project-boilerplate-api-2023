import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { rollDice } from "@providers/constants/DiceConstants";
import { GridManager } from "@providers/map/GridManager";
import { MapTiles } from "@providers/map/MapTiles";
import { INPCSeedData, NPCLoader } from "@providers/npc/NPCLoader";
import { ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(NPCSeeder)
export class NPCSeeder {
  constructor(private npcLoader: NPCLoader, private gridManager: GridManager, private mapTiles: MapTiles) {}

  public async seed(): Promise<void> {
    const npcSeedData = this.npcLoader.loadNPCSeedData();

    for (const [key, NPCData] of npcSeedData.entries()) {
      const npcFound = (await NPC.findOne({ tiledId: NPCData.tiledId, scene: NPCData.scene })) as unknown as INPC;

      NPCData.targetCharacter = undefined; // reset any targets

      this.setInitialNPCPositionAsSolid(NPCData);

      if (!npcFound) {
        // console.log(`🌱 Seeding database with NPC data for NPC with key: ${NPCData.key}`);

        await this.createNewNPCWithSkills(NPCData);
      } else {
        // if npc already exists, restart initial position

        // console.log(`🧍 Updating NPC ${NPCData.key} database data...`);

        await this.resetNPC(npcFound, NPCData);

        await this.updateNPCSkills(NPCData, npcFound);

        const updateData = _.omit(NPCData, ["skills"]);

        await NPC.updateOne(
          { key: key },
          {
            $set: {
              ...updateData,
            },
          },
          {
            upsert: true,
          }
        );
      }
    }
  }

  private async resetNPC(npc: INPC, NPCData: INPCSeedData): Promise<void> {
    try {
      const randomMaxHealth = this.setNPCRandomHealth(NPCData);

      if (randomMaxHealth) {
        npc.health = randomMaxHealth;
        npc.maxHealth = randomMaxHealth;
      } else {
        npc.health = npc.maxHealth;
      }

      npc.mana = npc.maxMana;
      npc.x = npc.initialX;
      npc.y = npc.initialY;
      npc.targetCharacter = undefined;
      npc.currentMovementType = npc.originalMovementType;

      await npc.save();
    } catch (error) {
      console.log(`❌ Failed to reset NPC ${NPCData.key}`);
      console.error(error);
    }
  }

  private async updateNPCSkills(NPCData: INPCSeedData, npc: INPC): Promise<void> {
    const skills = NPCData.skills as any;

    if (NPCData.skills) {
      await Skill.updateOne(
        {
          owner: npc._id,
          ownerType: "NPC",
        },
        {
          ...skills,
        }
      );
    }
  }

  private async createNewNPCWithSkills(NPCData: INPCSeedData): Promise<void> {
    try {
      const skills = new Skill({ ...(NPCData.skills as unknown as ISkill), ownerType: "NPC" }); // pre-populate skills, if present in metadata
      const npcHealth = this.setNPCRandomHealth(NPCData);

      const newNPC = new NPC({
        ...NPCData,
        maxHealth: npcHealth,
        skills: skills._id,
      });
      await newNPC.save();

      skills.owner = newNPC._id;

      await skills.save();
    } catch (error) {
      console.log(`❌ Failed to spawn NPC ${NPCData.key}. Is the blueprint for this NPC missing?`);

      console.error(error);
    }
  }

  private setNPCRandomHealth(NPCData: INPCSeedData): number {
    // ts-ignore is here until we update our ts-types lib
    // @ts-ignore
    if (NPCData.healthRandomizerDice && NPCData.baseHealth) {
      // @ts-ignore
      return NPCData.baseHealth + rollDice(NPCData.healthRandomizerDice);
    }

    // @ts-ignore
    return NPCData.maxHealth;
  }

  private setInitialNPCPositionAsSolid(NPCData: INPCSeedData): void {
    const { gridOffsetX, gridOffsetY } = this.gridManager.getGridOffset(NPCData.scene)!;

    try {
      // mark NPC initial position as solid on the map (pathfinding)
      this.gridManager.setWalkable(
        NPCData.scene,
        ToGridX(NPCData.x) + gridOffsetX,
        ToGridY(NPCData.y) + gridOffsetY,
        false
      );
    } catch (error) {
      console.log(
        `❌ Failed to set NPC ${NPCData.key} initial position (${NPCData.x}, ${NPCData.y}) as solid on the map (${NPCData.scene})`
      );

      console.error(error);
    }
  }
}
