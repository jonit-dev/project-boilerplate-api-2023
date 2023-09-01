import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  ContainersBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  GlovesBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  OthersBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDarkWraith: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Dark Wraith",
  key: HostileNPCsBlueprint.DarkWraith,
  textureKey: HostileNPCsBlueprint.Wraith,
  alignment: NPCAlignment.Hostile,
  speed: MovementSpeed.Fast,
  baseHealth: 800,
  healthRandomizerDice: Dice.D12,
  canSwitchToRandomTarget: true,
  skills: {
    level: 60,
    strength: {
      level: 60,
    },
    dexterity: {
      level: 100,
    },
    resistance: {
      level: 20,
    },
    magicResistance: {
      level: 70,
    },
    magic: {
      level: 60,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: CraftingResourcesBlueprint.IronOre,
      chance: 20,
      quantityRange: [2, 6],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 15,
      quantityRange: [1, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Silk,
      chance: 35,
      quantityRange: [1, 10],
    },
    {
      itemBlueprintKey: DaggersBlueprint.HellishDagger,
      chance: 5,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.RuneCrossbow,
      chance: 1,
    },
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 65,
      quantityRange: [10, 50],
    },
    {
      itemBlueprintKey: StaffsBlueprint.MoonsStaff,
      chance: 30,
    },

    {
      itemBlueprintKey: ContainersBlueprint.Backpack,
      chance: 10,
    },

    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 85,
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 60,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.PlateShield,
      chance: 15,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.PhoenixFeather,
      chance: 30,
      quantityRange: [5, 8],
    },
    {
      itemBlueprintKey: ArmorsBlueprint.MithrilArmor,
      chance: 20,
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.Silk,
      chance: 35,
      quantityRange: [1, 6],
    },
    {
      itemBlueprintKey: HelmetsBlueprint.BerserkersHelmet,
      chance: 2,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Corruption],
};
