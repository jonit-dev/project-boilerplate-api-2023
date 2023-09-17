import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { rollDice } from "@providers/constants/DiceConstants";
import {
  NPC_BASE_HEALTH_MULTIPLIER,
  NPC_SKILL_DEXTERITY_MULTIPLIER,
  NPC_SKILL_LEVEL_MULTIPLIER,
  NPC_SKILL_STRENGTH_MULTIPLIER,
  NPC_SPEED_MULTIPLIER,
} from "@providers/constants/NPCConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { Locker } from "@providers/locks/Locker";
import { GridManager } from "@providers/map/GridManager";
import { INPCSeedData, NPCLoader } from "@providers/npc/NPCLoader";
import { ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { clearCacheForKey } from "speedgoose";
import { NPCGiantForm } from "./NPCGiantForm";

@provide(NPCSeeder)
export class NPCSeeder {
  constructor(
    private npcLoader: NPCLoader,
    private gridManager: GridManager,
    private npcGiantForm: NPCGiantForm,
    private locker: Locker,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  public async seed(): Promise<void> {
    const npcSeedData = await this.npcLoader.loadNPCSeedData();

    for (const [key, NPCData] of npcSeedData.entries()) {
      const npcFound = (await NPC.findOne({ tiledId: NPCData.tiledId, scene: NPCData.scene }).lean({
        virtuals: true,
        defaults: true,
      })) as unknown as INPC;

      NPCData.targetCharacter = undefined; // reset any targets

      await this.setInitialNPCPositionAsSolid(NPCData);

      const multipliedNPCData = this.getNPCDataWithMultipliers(NPCData);

      if (!npcFound) {
        await this.createNewNPCWithSkills(multipliedNPCData);
      } else {
        // if npc already exists, restart initial position

        // console.log(`🧍 Updating NPC ${NPCData.key} database data...`);

        const updateData = _.omit(multipliedNPCData, ["skills"]);

        if (!_.isEqual(npcFound, updateData)) {
          await clearCacheForKey(`${npcFound.id}-skills`);

          await NPC.updateOne(
            { key: key },
            {
              // @ts-ignore
              $set: {
                ...updateData,
              },
            },
            {
              upsert: true,
            }
          );
        }

        await this.resetNPC(npcFound, multipliedNPCData);
        await this.updateNPCSkills(multipliedNPCData, npcFound);
        await this.npcGiantForm.resetNPCToNormalForm(npcFound);
        await this.npcGiantForm.randomlyTransformNPCIntoGiantForm(npcFound);
      }
    }
  }

  private async resetNPC(npc: INPC, NPCData: INPCSeedData): Promise<void> {
    try {
      await this.locker.unlock(`npc-death-${npc._id}`);
      await this.locker.unlock(`npc-body-generation-${npc._id}`);
      await this.locker.unlock(`npc-${npc._id}-release-xp`);
      await this.locker.unlock(`npc-${npc._id}-record-xp`);
      await this.locker.unlock(`npc-${npc._id}-battle-cycle`);

      await this.inMemoryHashTable.delete("npc-force-pathfinding-calculation", npc._id);

      const randomMaxHealth = this.setNPCRandomHealth(NPCData);

      const updateParams = {
        mana: npc.maxMana,
        x: npc.initialX,
        y: npc.initialY,
        targetCharacter: undefined,
        currentMovementType: npc.originalMovementType,
        xpToRelease: [],
      } as any;

      if (randomMaxHealth) {
        updateParams.health = randomMaxHealth;
        updateParams.maxHealth = randomMaxHealth;
      } else {
        updateParams.health = npc.maxHealth;
      }

      await NPC.updateOne({ _id: npc._id }, updateParams);
    } catch (error) {
      console.log(`❌ Failed to reset NPC ${NPCData.key}`);
      console.error(error);
    }
  }

  private async updateNPCSkills(NPCData: INPCSeedData, npc: INPC): Promise<void> {
    const skills = this.setNPCRandomSkillLevel(NPCData) as unknown as ISkill;

    if (skills?.level) {
      skills.level = skills.level * NPC_SKILL_LEVEL_MULTIPLIER;
    }
    if (skills?.strength?.level) {
      skills.strength.level = skills.strength.level * NPC_SKILL_STRENGTH_MULTIPLIER;
    }
    if (skills?.dexterity?.level) {
      skills.dexterity.level = skills.dexterity.level * NPC_SKILL_DEXTERITY_MULTIPLIER;
    }
    if (skills?.resistance?.level) {
      skills.resistance.level = skills.resistance.level * NPC_SKILL_DEXTERITY_MULTIPLIER;
    }
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
      const skills = new Skill({ ...(this.setNPCRandomSkillLevel(NPCData) as unknown as ISkill), ownerType: "NPC" }); // randomize skills present in the metadata only

      if (skills.level) {
        skills.level = skills.level * NPC_SKILL_LEVEL_MULTIPLIER;
      }
      if (skills.strength?.level) {
        skills.strength.level = skills.strength.level * NPC_SKILL_STRENGTH_MULTIPLIER;
      }
      if (skills.dexterity?.level) {
        skills.dexterity.level = skills.dexterity.level * NPC_SKILL_DEXTERITY_MULTIPLIER;
      }
      if (skills.resistance?.level) {
        skills.resistance.level = skills.resistance.level * NPC_SKILL_DEXTERITY_MULTIPLIER;
      }

      const npcHealth = this.setNPCRandomHealth(NPCData);

      const newNPC = new NPC({
        ...NPCData,
        health: npcHealth,
        maxHealth: npcHealth,
        skills: skills._id,
      });
      await newNPC.save();

      skills.owner = newNPC._id;

      await Promise.all([
        skills.save(),
        this.npcGiantForm.resetNPCToNormalForm(newNPC),
        this.npcGiantForm.randomlyTransformNPCIntoGiantForm(newNPC),
      ]);
    } catch (error) {
      console.log(`❌ Failed to spawn NPC ${NPCData.key}. Is the blueprint for this NPC missing?`);
      console.log(NPCData);

      console.error(error);
    }
  }

  private getNPCDataWithMultipliers(NPCData: INPCSeedData): INPCSeedData {
    const multipliedData = { ...NPCData };

    if (multipliedData.speed) {
      multipliedData.speed = Math.round(multipliedData.speed * NPC_SPEED_MULTIPLIER * 100) / 100;
    }

    if (multipliedData.baseHealth) {
      multipliedData.baseHealth = Math.round(multipliedData.baseHealth * NPC_BASE_HEALTH_MULTIPLIER);
    }

    return multipliedData;
  }

  private setNPCRandomSkillLevel(NPCData: INPCSeedData): Object {
    // Deep cloning object because all equals NPCs seeds references the same object.
    const clonedNPC = _.cloneDeep(NPCData);
    if (!clonedNPC.skillRandomizerDice) return clonedNPC.skills;

    /**
     * If we have skills to be randomized we apply the randomDice value to that
     * if not we get all skills added in the blueprint to change it's level
     */
    const skillKeys: string[] = clonedNPC.skillsToBeRandomized
      ? clonedNPC.skillsToBeRandomized
      : Object.keys(clonedNPC.skills);

    for (const skill of skillKeys) {
      if (!clonedNPC.skills[skill]) continue;

      if (skill === "level") {
        clonedNPC.skills[skill] = clonedNPC.skills[skill] + rollDice(clonedNPC.skillRandomizerDice);
      } else {
        clonedNPC.skills[skill].level = clonedNPC.skills[skill].level + rollDice(clonedNPC.skillRandomizerDice);
      }
    }

    return clonedNPC.skills;
  }

  private setNPCRandomHealth(NPCData: INPCSeedData): number {
    if (NPCData.healthRandomizerDice && NPCData.baseHealth) {
      return NPCData.baseHealth + rollDice(NPCData.healthRandomizerDice);
    }

    return NPCData.maxHealth;
  }

  private async setInitialNPCPositionAsSolid(NPCData: INPCSeedData): Promise<void> {
    try {
      // mark NPC initial position as solid on the map (pathfinding)
      await this.gridManager.setWalkable(NPCData.scene, ToGridX(NPCData.x), ToGridY(NPCData.y), false);
    } catch (error) {
      console.log(
        `❌ Failed to set NPC ${NPCData.key} initial position (${NPCData.x}, ${NPCData.y}) as solid on the map (${NPCData.scene})`
      );

      console.error(error);
    }
  }
}
