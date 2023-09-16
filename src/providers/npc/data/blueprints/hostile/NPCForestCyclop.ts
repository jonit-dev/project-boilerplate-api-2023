import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  HelmetsBlueprint,
  MacesBlueprint,
  ShieldsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcForestCyclop = {
  ...generateMoveTowardsMovement(),
  name: "Forest Cyclop",
  key: HostileNPCsBlueprint.ForestCyclops,
  textureKey: HostileNPCsBlueprint.ForestCyclops,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 800,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D20,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 75,
    strength: {
      level: 50,
    },
    dexterity: {
      level: 50,
    },
    resistance: {
      level: 60,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 15,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.AmethystHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.BanditShield,
      chance: 15,
    },

    {
      itemBlueprintKey: SwordsBlueprint.BasiliskSword,
      chance: 15,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
