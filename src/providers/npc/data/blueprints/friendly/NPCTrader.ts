import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  AxesBlueprint,
  FoodsBlueprint,
  MacesBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
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
      key: MacesBlueprint.Club,
    },
    {
      key: AxesBlueprint.Axe,
    },
    {
      key: ToolsBlueprint.ButchersKnife,
    },
    {
      key: ToolsBlueprint.Hammer,
    },
    {
      key: ToolsBlueprint.Pickaxe,
    },
    {
      key: ToolsBlueprint.CarpentersAxe,
    },
    {
      key: ShieldsBlueprint.WoodenShield,
    },
    {
      key: ToolsBlueprint.FishingRod,
    },
    {
      key: RangedWeaponsBlueprint.Bow,
    },
  ],
} as Partial<INPC>;
