import { ArmorsBlueprint, AxesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questKillYetis = {
  title: "Kill 3 Yetis",
  description:
    "For centuries, the legend of the yeti has terrified the villagers of Rivenn Island. As a brave adventurer, you've decided to venture into the yeti's lair and put an end to the legend once and for all. But be warned, for the yeti is a formidable and vicious creature, and you'll need all your strength and cunning to defeat it and emerge victorious.",
  key: QuestsBlueprint.KillYetis,
  rewards: [
    {
      itemKeys: [ArmorsBlueprint.GlacialArmor],
      qty: 1,
    },
    {
      itemKeys: [AxesBlueprint.GlacialAxe],
      qty: 1,
    },
  ],
  objectives: [
    {
      killCountTarget: 3,
      creatureKeys: [HostileNPCsBlueprint.Yeti],
      type: QuestType.Kill,
    },
  ],
} as Partial<IQuest>;
