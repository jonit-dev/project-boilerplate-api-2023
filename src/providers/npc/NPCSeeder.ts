import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { MapLoader } from "@providers/map/MapLoader";
import { INPCSeedData, NPCLoader } from "@providers/npc/NPCLoader";
import { ScenesMetaData, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(NPCSeeder)
export class NPCSeeder {
  constructor(private npcLoader: NPCLoader) {}

  public async seed(): Promise<void> {
    const npcSeedData = this.npcLoader.loadNPCSeedData();

    for (const [key, NPCData] of npcSeedData.entries()) {
      const npcFound = (await NPC.findOne({ tiledId: NPCData.tiledId })) as unknown as INPC;

      NPCData.targetCharacter = undefined; // reset any targets

      this.setInitialNPCPositionAsSolid(NPCData);

      if (!npcFound) {
        console.log(`🌱 Seeding database with NPC data for NPC with key: ${NPCData.key}`);

        const skills = new Skill({ ...NPCData.skills }); // pre-populate skills, if present in metadata

        const newNPC = new NPC({
          ...NPCData,
          skills: skills._id,
        });
        await newNPC.save();

        skills.owner = newNPC._id;

        await skills.save();
      } else {
        // if npc already exists, restart initial position

        console.log(`🧍 Updating NPC ${NPCData.key} database data...`);

        const skills = NPCData.skills as any;

        if (NPCData.skills) {
          await Skill.updateOne(
            {
              owner: npcFound._id,
            },
            {
              ...skills,
            },
            {
              upsert: true,
            }
          );
        }

        const updateData = _.omit(NPCData, ["skills"]);

        await NPC.updateOne(
          { key: key },
          {
            $set: {
              ...updateData,
            },
          }
        );
      }
    }
  }

  private setInitialNPCPositionAsSolid(NPCData: INPCSeedData): void {
    // mark NPC initial position as solid on the map (pathfinding)
    MapLoader.grids
      .get(ScenesMetaData[NPCData.scene].map)!
      .setWalkableAt(ToGridX(NPCData.x), ToGridY(NPCData.y), false);
  }
}
