import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  AxesBlueprint,
  DaggersBlueprint,
  MacesBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  StaffsBlueprint,
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
      key: AxesBlueprint.WoodenAxe,
    },
    {
      key: DaggersBlueprint.WoodenDagger,
    },
    {
      key: MacesBlueprint.WoodenMace,
    },
    {
      key: SwordsBlueprint.WoodenSword,
    },
    {
      key: ShieldsBlueprint.WoodenShield,
    },
    {
      key: StaffsBlueprint.WoodenStaff,
    },
    {
      key: RangedWeaponsBlueprint.WoodenBow,
    },
    {
      key: RangedWeaponsBlueprint.WoodenArrow,
    },
  ],
} as Partial<INPC>;
