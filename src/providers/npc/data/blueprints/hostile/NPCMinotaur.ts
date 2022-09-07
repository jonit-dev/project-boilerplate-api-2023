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
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";

import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMinotaur = {
  ...generateMoveTowardsMovement(),
  name: "Minotaur",
  key: HostileNPCsBlueprint.Minotaur,
  textureKey: HostileNPCsBlueprint.Minotaur,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 186,
  healthRandomizerDice: Dice.D4,
  skillRandomizerDice: Dice.D4,
  skills: {
    level: 8,
    strength: {
      level: 5,
    },
    dexterity: {
      level: 4,
    },
    resistance: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  experience: 80 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: SwordBlueprint.DragonsSword,
      chance: 10,
    },
    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 5,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 15,
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
      chance: 20,
    },
  ],
} as Partial<INPC>;
