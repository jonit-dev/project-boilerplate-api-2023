import { DaggersBlueprint, HelmetsBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questKillGoblins = {
  title: "Kill 5 Goblin",
  description:
    "Rumors have been circulating about strange noises and activity coming from a frozen cave on Rivenn Island. As a brave adventurer, it's up to you to investigate and discover the source of the disturbance. As you delve deeper into the cave, you'll uncover a group of orcs and goblins who are secretly mining the cave for its valuable resources. It's up to you to stop their operation and put an end to their schemes before they can do any more damage to the island. But be warned, for the orcs and goblins are not the only dangers lurking in the frozen depths of the cave.",
  key: QuestsBlueprint.KillGoblins,
  rewards: [
    {
      itemKeys: [SwordsBlueprint.GoldenSword],
      qty: 1,
    },
    {
      itemKeys: [HelmetsBlueprint.VikingHelmet],
      qty: 1,
    },
    {
      itemKeys: [DaggersBlueprint.Kunai],
      qty: 1,
    },
  ],
  objectives: [
    {
      killCountTarget: 5,
      creatureKeys: [HostileNPCsBlueprint.Goblin],
      type: QuestType.Kill,
    },
  ],
} as Partial<IQuest>;
