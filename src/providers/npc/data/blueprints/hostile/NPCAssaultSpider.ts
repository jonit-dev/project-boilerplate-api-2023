import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AccessoriesBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcAssaultSpider: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Assault Spider",
  key: HostileNPCsBlueprint.AssaultSpider,
  textureKey: HostileNPCsBlueprint.AssaultSpider,
  subType: NPCSubtype.Insect,

  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 60,
  healthRandomizerDice: Dice.D6,
  skills: {
    level: 7,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 2,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 5,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.DarkWizardHat,
      chance: 20,
    },
    {
      itemBlueprintKey: StaffsBlueprint.CorruptionStaff,
      chance: 5,
    },
    {
      itemBlueprintKey: DaggersBlueprint.CorruptionDagger,
      chance: 15,
    },

    {
      itemBlueprintKey: AccessoriesBlueprint.CorruptionNecklace,
      chance: 10,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.StarNecklace,
      chance: 6,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.MagicRecipe,
      chance: 10,
      quantityRange: [1, 5],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Poison],
};
