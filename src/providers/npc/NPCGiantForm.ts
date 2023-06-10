import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import {
  NPC_GIANT_FORM_SPAWN_PERCENTAGE_CHANCE,
  NPC_GIANT_FORM_STATS_MULTIPLIER,
} from "@providers/constants/NPCConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { NPCAlignment } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { clearCacheForKey } from "speedgoose";

interface INPCNormalFormStats {
  npc: {
    maxHealth: number;
    maxMana: number;
  };
  skills: {
    level: number;
    strength: {
      level: number;
    };
    dexterity: {
      level: number;
    };
    resistance: {
      level: number;
    };
  };
}

@provide(NPCGiantForm)
export class NPCGiantForm {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async resetNPCToNormalForm(npc: INPC): Promise<void> {
    if (!npc.isGiantForm) return;

    await NPC.updateOne(
      { _id: npc._id },
      {
        isGiantForm: false,
      }
    );
    await this.restoreNPCStatsToNormalForm(npc);
  }

  public async randomlyTransformNPCIntoGiantForm(
    npc: INPC,
    percent = NPC_GIANT_FORM_SPAWN_PERCENTAGE_CHANCE
  ): Promise<void> {
    await clearCacheForKey(`npc-${npc.id}-skills`);

    if (npc.isGiantForm || npc.alignment !== NPCAlignment.Hostile) return;

    const n = _.random(0, 100);
    if (n <= percent) {
      await NPC.updateOne(
        { _id: npc._id },
        {
          isGiantForm: true,
        }
      );
      await this.increaseNPCStatsForGiantForm(npc);
    }
  }

  private async increaseNPCStatsForGiantForm(npc: INPC): Promise<void> {
    const skills = await Skill.findOne({ owner: npc._id, ownerType: "NPC" });
    if (!skills) return;

    const normalFormStats: INPCNormalFormStats = {
      npc: {
        maxHealth: npc.maxHealth,
        maxMana: npc.maxMana,
      },
      skills: {
        level: skills.level,
        strength: {
          level: skills.strength.level,
        },
        dexterity: {
          level: skills.dexterity.level,
        },
        resistance: {
          level: skills.resistance.level,
        },
      },
    };
    await this.inMemoryHashTable.set("npc-normal-form-stats", npc.key, normalFormStats);

    await NPC.updateOne(
      { _id: npc._id },
      {
        maxHealth: Math.ceil(npc.maxHealth * NPC_GIANT_FORM_STATS_MULTIPLIER),
        health: Math.ceil(npc.maxHealth * NPC_GIANT_FORM_STATS_MULTIPLIER),
        maxMana: Math.ceil(npc.maxMana * NPC_GIANT_FORM_STATS_MULTIPLIER),
        mana: Math.ceil(npc.maxMana * NPC_GIANT_FORM_STATS_MULTIPLIER),
      }
    );

    await Skill.updateOne(
      { _id: skills._id },
      {
        level: Math.ceil(skills.level * NPC_GIANT_FORM_STATS_MULTIPLIER),
        strength: {
          level: Math.ceil(skills.strength.level * NPC_GIANT_FORM_STATS_MULTIPLIER),
        },
        dexterity: {
          level: Math.ceil(skills.dexterity.level * NPC_GIANT_FORM_STATS_MULTIPLIER),
        },
        resistance: {
          level: Math.ceil(skills.resistance.level * NPC_GIANT_FORM_STATS_MULTIPLIER),
        },
      }
    );
  }

  private async restoreNPCStatsToNormalForm(npc: INPC): Promise<void> {
    const normalFormStats = (await this.inMemoryHashTable.get("npc-normal-form-stats", npc.key)) as unknown as
      | INPCNormalFormStats
      | undefined;
    if (!normalFormStats) return;

    await NPC.updateOne(
      { _id: npc._id },
      {
        maxHealth: normalFormStats.npc.maxHealth,
        health: normalFormStats.npc.maxHealth,
        maxMana: normalFormStats.npc.maxMana,
        mana: normalFormStats.npc.maxMana,
      }
    );

    await Skill.updateOne(
      { owner: npc._id, ownerType: "NPC" },
      {
        ...normalFormStats.skills,
      }
    );
  }
}
