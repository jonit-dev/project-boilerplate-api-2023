import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";

import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

import {
  AxesBlueprint,
  BowsBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetBlueprint,
  PotionsBlueprint,
  ShieldsBlueprint,
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
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 30,
    strength: {
      level: 30,
    },
    dexterity: {
      level: 12,
    },
  },
  fleeOnLowHealth: true,
  experience: 300 * EXP_RATIO,
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
      itemBlueprintKey: HelmetBlueprint.SoldiersHelmet,
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
      itemBlueprintKey: BowsBlueprint.Bolt,
      chance: 50,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: BowsBlueprint.Bow,
      chance: 20,
    },

    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
  ],
} as Partial<INPC>;
