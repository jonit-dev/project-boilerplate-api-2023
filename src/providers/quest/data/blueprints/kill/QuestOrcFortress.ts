import {
  AccessoriesBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questOrcFortress = {
  title: "Eliminate some Orcs",
  description:
    "Orcs are plaguing the area and they're planning a raid soon! You can find them on the Orc fortress and kill as many as you can. Be careful, though, they're evil and wouldn't hesitate to split your flash in two!",
  key: QuestsBlueprint.OrcFortress,
  rewards: [
    {
      itemKeys: [RangedWeaponsBlueprint.OrcishBow],
      qty: 1,
    },
    {
      itemKeys: [AccessoriesBlueprint.ElvenRing],
      qty: 1,
    },
    {
      itemKeys: [SwordsBlueprint.ElvenSword],
      qty: 1,
    },
  ],
  objectives: [
    {
      killCountTarget: 10,
      creatureKeys: [HostileNPCsBlueprint.Orc],
      type: QuestType.Kill,
    },
  ],
} as Partial<IQuest>;
