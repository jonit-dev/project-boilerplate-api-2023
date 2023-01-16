import { BootsBlueprint, MacesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questKillWinterWolves = {
  title: "Kill 7 Winter WOlves",
  description:
    "An expedition team is sent to study the Winter Wolves living on a remote island, Rivenn. They discover that these wolves have an advanced intelligence and a mysterious leader, the Alpha Wolf, who will do anything to protect his pack and territory from intruders. The team must use all their skills and knowledge to survive the harsh conditions and outsmart the Alpha Wolf to uncover the truth about the island and the Winter Wolves.",
  key: QuestsBlueprint.KillWinterWolves,
  rewards: [
    {
      itemKeys: [SwordsBlueprint.Katana],
      qty: 1,
    },
    {
      itemKeys: [BootsBlueprint.GoldenBoots],
      qty: 1,
    },
    {
      itemKeys: [MacesBlueprint.SpikedMace],
      qty: 1,
    },
  ],
  objectives: [
    {
      killCountTarget: 7,
      creatureKeys: [HostileNPCsBlueprint.WinterWolf],
      type: QuestType.Kill,
    },
  ],
} as Partial<IQuest>;
