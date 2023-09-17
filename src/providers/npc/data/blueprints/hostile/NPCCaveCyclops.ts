import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AccessoriesBlueprint,
  AxesBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcCaveCyclops = {
  ...generateMoveTowardsMovement(),
  name: "Cave Cyclops",
  key: HostileNPCsBlueprint.CaveCyclops,
  textureKey: HostileNPCsBlueprint.CaveCyclops,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 1400,
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
      level: 45,
    },
    resistance: {
      level: 70,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: AxesBlueprint.GoldenAxe,
      chance: 25,
    },
    {
      itemBlueprintKey: DaggersBlueprint.PhoenixDagger,
      chance: 15,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.HellishBow,
      chance: 5,
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.ObsidiumOre,
      chance: 15,
    },

    {
      itemBlueprintKey: AccessoriesBlueprint.SapphireRing,
      chance: 10,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
