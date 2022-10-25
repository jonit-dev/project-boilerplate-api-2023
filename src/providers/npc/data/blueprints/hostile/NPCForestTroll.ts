import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

import {
  BootsBlueprint,
  ContainersBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  MacesBlueprint,
  OthersBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";

export const npcForestTroll = {
  ...generateMoveTowardsMovement(),
  name: "Forest Troll",
  key: HostileNPCsBlueprint.ForestTroll,
  textureKey: HostileNPCsBlueprint.ForestTroll,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 190,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 17,
    strength: {
      level: 18,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 14,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 30,
      quantityRange: [25, 60],
    },
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
      itemBlueprintKey: SpearsBlueprint.Spear,
      chance: 20,
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
} as Partial<INPC>;
