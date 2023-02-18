import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  ArmorsBlueprint,
  AxesBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  MagicsBlueprint,
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
  speed: MovementSpeed.Standard,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: RangedWeaponsBlueprint.Stone,
  maxRangeAttack: 8,
  baseHealth: 1000,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D20,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 70,
    strength: {
      level: 100,
    },
    dexterity: {
      level: 40,
    },
    resistance: {
      level: 800,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 30,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.MithrilArmor,
      chance: 5,
    },
    {
      itemBlueprintKey: LegsBlueprint.MithrilLegs,
      chance: 5,
    },
    {
      itemBlueprintKey: LegsBlueprint.BronzeLegs,
      chance: 10,
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
    {
      itemBlueprintKey: MagicsBlueprint.FireRune,
      chance: 10,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.PhoenixFeather,
      chance: 5,
      quantityRange: [5, 10],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
