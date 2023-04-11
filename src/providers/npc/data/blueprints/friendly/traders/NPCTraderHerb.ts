import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { generateRandomMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcTraderHerbalist = {
  ...generateRandomMovement(),
  key: "trader-herb",
  name: "Nightshade the Herbalist",
  textureKey: "human-girl-1",
  gender: CharacterGender.Female,
  isTrader: true,
  traderItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
    },
    {
      key: CraftingResourcesBlueprint.Worm,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
    },
  ],
} as Partial<INPC>;
