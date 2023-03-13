import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  DaggersBlueprint,
  MacesBlueprint,
  ShieldsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { generateRandomMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";
import { CharacterGender } from "@rpg-engine/shared";

export const npcTraderTraining = {
  ...generateRandomMovement(),
  key: "trader-training",
  name: "Master Bladewind",
  textureKey: "dwarf",
  gender: CharacterGender.Male,
  isTrader: true,
  traderItems: [
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
  ],
} as Partial<INPC>;
