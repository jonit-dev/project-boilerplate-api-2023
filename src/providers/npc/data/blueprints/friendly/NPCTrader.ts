import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  AxesBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  FoodsBlueprint,
  MacesBlueprint,
  MagicsBlueprint,
  PotionsBlueprint,
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
      key: PotionsBlueprint.LightLifePotion,
    },
    {
      key: PotionsBlueprint.LightAntidote,
    },
    {
      key: PotionsBlueprint.GreaterLifePotion,
    },
    {
      key: CraftingResourcesBlueprint.Bandage,
    },
    {
      key: PotionsBlueprint.ManaPotion,
    },
    {
      key: AxesBlueprint.WoodenAxe,
    },
    {
      key: DaggersBlueprint.WoodenDagger,
    },
    {
      key: MacesBlueprint.WoodenMace,
    },
    {
      key: ShieldsBlueprint.WoodenShield,
    },
    {
      key: SwordsBlueprint.WoodenSword,
    },
    {
      key: FoodsBlueprint.Cheese,
    },

    {
      key: MagicsBlueprint.Rune,
    },
    {
      key: MagicsBlueprint.FireBoltRune,
    },
    {
      key: MagicsBlueprint.PoisonRune,
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
      key: ToolsBlueprint.FishingRod,
    },
    {
      key: RangedWeaponsBlueprint.Bow,
    },
    {
      key: RangedWeaponsBlueprint.Crossbow,
    },
    {
      key: RangedWeaponsBlueprint.Arrow,
    },
    {
      key: RangedWeaponsBlueprint.Bolt,
    },
    {
      key: RangedWeaponsBlueprint.IronArrow,
    },
  ],
} as Partial<INPC>;
