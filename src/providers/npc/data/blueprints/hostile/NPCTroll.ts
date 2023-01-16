import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HelmetsBlueprint,
  MacesBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";

export const npcTroll = {
  ...generateMoveTowardsMovement(),
  name: "Troll",
  key: HostileNPCsBlueprint.Troll,
  textureKey: HostileNPCsBlueprint.Troll,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 600,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D20,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 50,
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
      itemBlueprintKey: MacesBlueprint.Club,
      chance: 25,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.BlueSapphire,
      chance: 30,
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
      itemBlueprintKey: RangedWeaponsBlueprint.HuntersBow,
      chance: 5,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.GladiatorHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Bow,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.GreaterWoodenLog,
      chance: 30,
      quantityRange: [1, 2],
    },
    {
      itemBlueprintKey: StaffsBlueprint.PoisonStaff,
      chance: 10,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
