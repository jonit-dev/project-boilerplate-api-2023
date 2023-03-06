import { AxesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questKillFrostSalamanders = {
  title: "Kill 5 Frost Salamanders",
  description:
    "A group of frost salamanders, creatures native to Rivenn Island, have been acting strangely and causing disruptions in the nearby village. It's up to you to investigate the cause of their behavior and put a stop to it. As you delve deeper into the mystery, you'll discover that the frost salamanders have been cursed by a powerful and malevolent force, and must find a way to lift the curse and restore balance to the natural world. But be warned, for the curse is powerful and the frost salamanders are not the only dangers you'll face on this quest.",
  key: QuestsBlueprint.KillFrostSalamanders,
  rewards: [
    {
      itemKeys: [AxesBlueprint.NordicAxe],
      qty: 1,
    },
  ],
  objectives: [
    {
      killCountTarget: 5,
      creatureKeys: [HostileNPCsBlueprint.FrostSalamander],
      type: QuestType.Kill,
    },
  ],
} as Partial<IQuest>;
