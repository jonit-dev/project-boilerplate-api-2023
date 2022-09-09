import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { MapLoader } from "@providers/map/MapLoader";
import { MapObjectsLoader } from "@providers/map/MapObjectsLoader";
import { IQuest } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { questsBlueprintIndex } from "./data/index";

interface INPCQuestKeys {
  npcId?: string;
  npcKey: string;
  questKey: string;
}

interface IQuestSeedData extends Omit<IQuest, "_id"> {}

@provide(QuestLoader)
export class QuestLoader {
  constructor(private mapObjectsLoader: MapObjectsLoader) {}

  public async loadQuestSeedData(): Promise<IQuestSeedData[]> {
    const questSeedData: IQuestSeedData[] = [];

    for (const [mapName, mapData] of MapLoader.maps.entries()) {
      const NPCs = this.mapObjectsLoader.getObjectLayerData("NPCs", mapData);

      if (!NPCs) {
        continue;
      }

      const npcQuestKeys = getNpcKeysWithQuests(NPCs);

      const uniqueArrayKeys = Array.from(new Set(npcQuestKeys));
      checkIfQuestBlueprintsExists(uniqueArrayKeys, mapName);
      await getNPCsIds(uniqueArrayKeys);

      for (const keys of uniqueArrayKeys) {
        const data = questsBlueprintIndex[keys.questKey] as IQuest;
        data.npcId = keys.npcId!;
        questSeedData.push({ ...data });
      }
    }
    return questSeedData;
  }
}

function getNpcKeysWithQuests(NPCs: any[]): INPCQuestKeys[] {
  const npcQuests: INPCQuestKeys[] = [];
  for (const npc of NPCs) {
    const npcKey = `${npc.properties.find((p) => p.name === "key")?.value}-${npc.id}`;
    const questKeys = npc.properties.find((p) => p.name === "questKeys")?.value;

    if (questKeys) {
      const questsData = questKeys.split(",").map((key: string) => {
        return { npcKey, questKey: key.trim() };
      });
      npcQuests.push(...questsData);
    }
  }

  return npcQuests;
}

function checkIfQuestBlueprintsExists(keys: INPCQuestKeys[], mapName: string): void {
  const missingQuests = keys.filter((key) => !questsBlueprintIndex[key.questKey]);
  if (missingQuests.length > 0) {
    throw new Error(
      `❌ QuestLoader: Missing Quest blueprints for keys ${missingQuests.join(
        ", "
      )}. Please, double check the map ${mapName}`
    );
  }
}

async function getNPCsIds(keys: INPCQuestKeys[]): Promise<void> {
  for (const i in keys) {
    const npcData = (await NPC.findOne({ key: keys[i].npcKey })) as INPC;
    if (!npcData) {
      throw new Error(
        `❌ QuestLoader: Missing an NPC with Quest. NPC key ${keys[i].npcKey}. Please, double check if NPCs are created correctly before seeding quests`
      );
    }
    keys[i].npcId = npcData._id.toString();
  }
}
