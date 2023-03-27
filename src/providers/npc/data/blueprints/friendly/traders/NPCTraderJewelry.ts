import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { generateRandomMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcTraderJewelry = {
  ...generateRandomMovement(),
  key: "Darcy Langley",
  name: "Darcy Langley",
  textureKey: "human-girl-4",
  gender: CharacterGender.Female,
  isTrader: true,
  traderItems: [
    {
      key: AccessoriesBlueprint.StarNecklace,
    },
    {
      key: AccessoriesBlueprint.AmazonsNecklace,
    },
    {
      key: AccessoriesBlueprint.IronRing,
    },
  ],
} as Partial<INPC>;
