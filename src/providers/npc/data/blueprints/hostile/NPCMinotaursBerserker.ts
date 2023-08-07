import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  BootsBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  SpearsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMinotaurBerserker = {
  ...generateMoveTowardsMovement(),
  name: "Minotaur Berserker",
  key: HostileNPCsBlueprint.MinotaurBerserker,
  textureKey: HostileNPCsBlueprint.MinotaurBerserker,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  canSwitchToLowHealthTarget: true,
  baseHealth: 650,
  healthRandomizerDice: Dice.D20,
  skillRandomizerDice: Dice.D8,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 45,
    strength: {
      level: 40,
    },
    dexterity: {
      level: 24,
    },
    resistance: {
      level: 38,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.RoyalBoots,
      chance: 3,
    },
    {
      itemBlueprintKey: SpearsBlueprint.GuanDao,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },
    {
      itemBlueprintKey: SwordsBlueprint.PoisonSword,
      chance: 20,
    },

    {
      itemBlueprintKey: DaggersBlueprint.CopperJitte,
      chance: 10,
    },
    {
      itemBlueprintKey: DaggersBlueprint.DamascusJitte,
      chance: 10,
    },

    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 85,
    },
    {
      itemBlueprintKey: SpearsBlueprint.Trident,
      chance: 4,
    },
    {
      itemBlueprintKey: SwordsBlueprint.KnightsSword,
      chance: 5,
    },
    {
      itemBlueprintKey: HammersBlueprint.WarHammer,
      chance: 10,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.InfantryHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.BasiliskSword,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.CopperBroadsword,
      chance: 10,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Jade,
      chance: 20,
      quantityRange: [1, 5],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
