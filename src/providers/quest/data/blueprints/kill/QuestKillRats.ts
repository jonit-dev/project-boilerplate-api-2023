import { ShieldsBlueprint, SwordBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questKillRats = {
  title: "Kill 10 Rats",
  description:
    "These damn rats are everywhere! Please help me to kill them to avoid spreading diseases to our village.",
  key: QuestsBlueprint.KillRats,
  rewards: [
    {
      itemKeys: [SwordBlueprint.ShortSword],
      qty: 1,
    },
    {
      itemKeys: [ShieldsBlueprint.WoodenShield],
      qty: 1,
    },
  ],
  objectives: [
    {
      killCountTarget: 10,
      creatureKeys: [HostileNPCsBlueprint.Rat],
      type: QuestType.Kill,
    },
  ],
} as Partial<IQuest>;
