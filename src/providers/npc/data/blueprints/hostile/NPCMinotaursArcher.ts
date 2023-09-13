import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  FoodsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { NPCAlignment, RangeTypes } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcMinotaurArcher = {
  ...generateMoveTowardsMovement(),
  name: "Minotaur Archer",
  key: HostileNPCsBlueprint.MinotaurArcher,
  textureKey: HostileNPCsBlueprint.MinotaurArcher,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Ranged,
  ammoKey: RangedWeaponsBlueprint.FireBolt,
  maxRangeAttack: RangeTypes.High,
  speed: MovementSpeed.Fast,
  canSwitchToLowHealthTarget: true,
  baseHealth: 500,
  healthRandomizerDice: Dice.D8,
  skillRandomizerDice: Dice.D8,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 45,
    strength: {
      level: 40,
    },
    dexterity: {
      level: 24,
    },
    resistance: {
      level: 38,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.RoyalBoots,
      chance: 3,
    },
    {
      itemBlueprintKey: DaggersBlueprint.IronJitte,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },

    {
      itemBlueprintKey: RangedWeaponsBlueprint.RoyalCrossbow,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.FireBolt,
      chance: 30,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: ArmorsBlueprint.BronzeArmor,
      chance: 20,
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.Jade,
      chance: 20,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Herb,
      chance: 20,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.WaterBottle,
      chance: 20,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.EaglesEyeBow,
      chance: 10,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Burning],
} as Partial<INPC>;
