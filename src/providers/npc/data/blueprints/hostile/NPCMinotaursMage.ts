import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { AnimationEffectKeys, NPCAlignment, RangeTypes } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMinotaurMage = {
  ...generateMoveTowardsMovement(),
  name: "Minotaur Mage",
  key: HostileNPCsBlueprint.MinotaurMage,
  textureKey: HostileNPCsBlueprint.MinotaurMage,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: AnimationEffectKeys.FireBall,
  maxRangeAttack: RangeTypes.High,
  speed: MovementSpeed.Standard,
  canSwitchToLowHealthTarget: true,
  baseHealth: 600,
  healthRandomizerDice: Dice.D4,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 70,
    strength: {
      level: 75,
    },
    dexterity: {
      level: 60,
    },
    resistance: {
      level: 30,
    },
    magicResistance: {
      level: 50,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: StaffsBlueprint.MoonsStaff,
      chance: 2,
    },
    {
      itemBlueprintKey: StaffsBlueprint.RoyalStaff,
      chance: 7,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 60,
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterManaPotion,
      chance: 25,
    },
    {
      itemBlueprintKey: SwordsBlueprint.GoldenSword,
      chance: 4,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 20,
    },
    {
      itemBlueprintKey: DaggersBlueprint.PhoenixDagger,
      chance: 20,
    },
    {
      itemBlueprintKey: DaggersBlueprint.PhoenixJitte,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.FoodRecipe,
      chance: 10,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Eye,
      chance: 50,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Herb,
      chance: 55,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.PolishedStone,
      chance: 50,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.RuneCrossbow,
      chance: 1,
    },

    {
      itemBlueprintKey: ShieldsBlueprint.DarkShield,
      chance: 1,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.PhoenixFeather,
      chance: 30,
      quantityRange: [5, 8],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Burning],
} as Partial<INPC>;
