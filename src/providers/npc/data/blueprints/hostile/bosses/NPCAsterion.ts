import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  BootsBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  LegsBlueprint,
  PotionsBlueprint,
  SpearsBlueprint,
  SwordBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { BossesNPCsBlueprint, HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { generateMoveTowardsMovement } from "@providers/npc/data/abstractions/BaseNeutralNPC";

import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";

export const npcAsterion = {
  ...generateMoveTowardsMovement(),
  name: "Asterion",
  key: BossesNPCsBlueprint.Asterion,
  textureKey: HostileNPCsBlueprint.Minotaur,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  canSwitchToLowHealthTarget: true,
  baseHealth: 386,
  healthRandomizerDice: Dice.D20,
  skills: {
    level: 20,
    strength: {
      level: 15,
    },
    dexterity: {
      level: 14,
    },
    resistance: {
      level: 13,
    },
  },
  fleeOnLowHealth: true,
  experience: 400 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: SwordBlueprint.DragonsSword,
      chance: 100,
    },
    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 30,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 85,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 60,
    },
  ],
} as Partial<INPC>;
