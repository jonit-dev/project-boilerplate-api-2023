import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";

import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

import {
  FoodsBlueprint,
  GlovesBlueprint,
  HelmetBlueprint,
  MacesBlueprint,
  PotionsBlueprint,
  RangedBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";

export const npcTrollWarrior = {
  ...generateMoveTowardsMovement(),
  name: "Troll Warrior",
  key: HostileNPCsBlueprint.TrollWarrior,
  textureKey: HostileNPCsBlueprint.TrollWarrior,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 260,
  healthRandomizerDice: Dice.D20,
  skillRandomizerDice: Dice.D12,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 23,
    strength: {
      level: 24,
    },
    dexterity: {
      level: 10,
    },
  },
  fleeOnLowHealth: true,
  experience: 220 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: MacesBlueprint.Mace,
      chance: 25,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: HelmetBlueprint.BrassHelmet,
      chance: 20,
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
      itemBlueprintKey: RangedBlueprint.Bolt,
      chance: 50,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: RangedBlueprint.Bow,
      chance: 20,
    },

    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
  ],
} as Partial<INPC>;
