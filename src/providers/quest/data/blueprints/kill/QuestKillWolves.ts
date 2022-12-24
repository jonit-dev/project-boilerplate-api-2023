import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { IQuest, QuestType } from "@rpg-engine/shared";
import { QuestsBlueprint } from "../../questsBlueprintTypes";

export const questKillWolves = {
  title: "Let's get rid of the wolves",
  description:
    "Wolves have been causing chaos in the village, attacking livestock and endangering the lives of innocent people. Brave heroes have been called upon to put an end to this threat. You must venture into the dense forests where the wolves reside and hunt them down. But be warned, these wolves are cunning and fierce, and will stop at nothing to protect their territory. Will you be able to rid the village of this danger and restore peace to the land?",
  key: QuestsBlueprint.KillWolves,
  rewards: [
    {
      itemKeys: [RangedWeaponsBlueprint.Arrow],
      qty: 50,
    },
    {
      itemKeys: [RangedWeaponsBlueprint.Bow],
      qty: 50,
    },
  ],
  objectives: [
    {
      killCountTarget: 5,
      creatureKeys: [HostileNPCsBlueprint.Wolf],
      type: QuestType.Kill,
    },
  ],
} as Partial<IQuest>;
