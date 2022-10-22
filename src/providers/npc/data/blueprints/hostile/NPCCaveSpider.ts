import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  AxesBlueprint,
  BootsBlueprint,
  LegsBlueprint,
  OthersBlueprint,
  PotionsBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcCaveSpider: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Cave Spider",
  key: HostileNPCsBlueprint.CaveSpider,
  textureKey: HostileNPCsBlueprint.CaveSpider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 75,
  healthRandomizerDice: Dice.D6,
  skills: {
    level: 9,
    strength: {
      level: 5,
    },
    dexterity: {
      level: 6,
    },
    resistance: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  experience: 22 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 30,
      quantityRange: [3, 10],
    },
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 20,
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 5,
    },
    {
      itemBlueprintKey: SwordsBlueprint.BroadSword,
      chance: 15,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.PlateShield,
      chance: 5,
    },
    {
      itemBlueprintKey: AxesBlueprint.Bardiche,
      chance: 5,
    },
    {
      itemBlueprintKey: BootsBlueprint.Sandals,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 2.5,
    },
  ],
};
