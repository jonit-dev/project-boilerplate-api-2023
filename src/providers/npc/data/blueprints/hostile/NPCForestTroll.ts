import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  BootsBlueprint,
  ContainersBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  MacesBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";

export const npcForestTroll = {
  ...generateMoveTowardsMovement(),
  name: "Forest Troll",
  key: HostileNPCsBlueprint.ForestTroll,
  textureKey: HostileNPCsBlueprint.ForestTroll,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 600,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D20,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 60,
    strength: {
      level: 45,
    },
    dexterity: {
      level: 40,
    },
    resistance: {
      level: 50,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 25,
    },
    {
      itemBlueprintKey: GlovesBlueprint.LeatherGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: PotionsBlueprint.LightLifePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
      chance: 50,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: HelmetsBlueprint.ArabicHelmet,
      chance: 10,
    },

    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
    {
      itemBlueprintKey: ContainersBlueprint.Backpack,
      chance: 10,
    },
    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 15,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.StuddedShield,
      chance: 15,
    },
    {
      itemBlueprintKey: HammersBlueprint.WarHammer,
      chance: 1,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
