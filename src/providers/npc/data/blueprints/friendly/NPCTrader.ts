import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  FoodsBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
  ToolsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { CharacterGender } from "@rpg-engine/shared";
import { generateRandomMovement } from "../../abstractions/BaseNeutralNPC";

export const npcTrader = {
  ...generateRandomMovement(),
  key: "trader",
  name: "Trader Joe",
  textureKey: FriendlyNPCsBlueprint.Trader,
  gender: CharacterGender.Male,
  isTrader: true,
  traderItems: [
    {
      key: FoodsBlueprint.Fish,
    },
    {
      key: FoodsBlueprint.Watermelon,
    },
    {
      key: FoodsBlueprint.Cheese,
    },
    {
      key: SwordsBlueprint.ShortSword,
    },
    {
      key: ToolsBlueprint.ButchersKnife,
    },
    {
      key: ToolsBlueprint.CarpentersAxe,
    },
    {
      key: ToolsBlueprint.FishingRod,
    },
    {
      key: ToolsBlueprint.Pickaxe,
    },
    {
      key: RangedWeaponsBlueprint.Arrow,
    },
    {
      key: RangedWeaponsBlueprint.Bolt,
    },
  ],
} as Partial<INPC>;
