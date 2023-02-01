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
  HammersBlueprint,
  HelmetsBlueprint,
  MacesBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";

export const npcWildTroll = {
  ...generateMoveTowardsMovement(),
  name: "Wild Troll",
  key: HostileNPCsBlueprint.WildTroll,
  textureKey: HostileNPCsBlueprint.WildTroll,
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
      level: 30,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 25,
    },
    {
      itemBlueprintKey: GlovesBlueprint.StuddedGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.GladiatorHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: HammersBlueprint.RoyalHammer,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Bolt,
      chance: 50,
      quantityRange: [5, 10],
    },

    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.WoodenSticks,
      chance: 10,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.PhoenixFeather,
      chance: 20,
      quantityRange: [1, 5],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
