import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AxesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HelmetsBlueprint,
  MacesBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";

export const npcTrollWarrior = {
  ...generateMoveTowardsMovement(),
  name: "Troll Warrior",
  key: HostileNPCsBlueprint.TrollWarrior,
  textureKey: HostileNPCsBlueprint.TrollWarrior,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 600,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D20,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 70,
    strength: {
      level: 70,
    },
    dexterity: {
      level: 20,
    },
    resistance: {
      level: 50,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: MacesBlueprint.Mace,
      chance: 25,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.InfantryHelmet,
      chance: 15,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.ScutumShield,
      chance: 2,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.BrassHelmet,
      chance: 20,
    },

    {
      itemBlueprintKey: RangedWeaponsBlueprint.Bolt,
      chance: 50,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Bow,
      chance: 20,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.RoyalBow,
      chance: 5,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
    {
      itemBlueprintKey: StaffsBlueprint.PoisonStaff,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Shuriken,
      chance: 10,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: AxesBlueprint.HandAxe,
      chance: 5,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
