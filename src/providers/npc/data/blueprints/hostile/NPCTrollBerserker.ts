import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

import {
  AxesBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";

export const npcTrollBerserker = {
  ...generateMoveTowardsMovement(),
  name: "Troll Berserker",
  key: HostileNPCsBlueprint.TrollBerserker,
  textureKey: HostileNPCsBlueprint.TrollBerserker,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 320,
  healthRandomizerDice: Dice.D20,
  skillRandomizerDice: Dice.D12,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 30,
    strength: {
      level: 30,
    },
    dexterity: {
      level: 30,
    },
    resistance: {
      level: 30,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 30,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.PlateShield,
      chance: 15,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.SoldiersHelmet,
      chance: 30,
    },
    {
      itemBlueprintKey: AxesBlueprint.DoubleAxe,
      chance: 15,
    },
    {
      itemBlueprintKey: HammersBlueprint.WarHammer,
      chance: 5,
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 30,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Bolt,
      chance: 50,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.RoyalCrossbow,
      chance: 5,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Bow,
      chance: 20,
    },

    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.GreaterWoodenLog,
      chance: 30,
      quantityRange: [1, 2],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 10,
      quantityRange: [1, 2],
    },
    {
      itemBlueprintKey: SwordsBlueprint.Rapier,
      chance: 10,
    },
  ],
} as Partial<INPC>;
