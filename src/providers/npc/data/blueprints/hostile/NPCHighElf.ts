import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  AccessoriesBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  HelmetsBlueprint,
  OthersBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcHighElf: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "High Elf",
  key: HostileNPCsBlueprint.HighElf,
  textureKey: "elf-white-hair-1",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  ammoKey: RangedWeaponsBlueprint.Arrow,
  maxRangeAttack: 8,
  speed: MovementSpeed.Fast,
  baseHealth: 800,
  healthRandomizerDice: Dice.D12,
  canSwitchToRandomTarget: true,
  skills: {
    level: 60,
    strength: {
      level: 60,
    },
    dexterity: {
      level: 100,
    },
    resistance: {
      level: 20,
    },
    magicResistance: {
      level: 70,
    },
    magic: {
      level: 60,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Blueberry,
      chance: 75,
      quantityRange: [1, 10],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.PhoenixBow,
      chance: 5,
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 25,
      quantityRange: [1, 2],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Silk,
      chance: 35,
      quantityRange: [1, 6],
    },
    {
      itemBlueprintKey: HelmetsBlueprint.BerserkersHelmet,
      chance: 2,
    },
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 50,
      quantityRange: [45, 75],
    },
    {
      itemBlueprintKey: HelmetsBlueprint.RoyalHelmet,
      chance: 30,
    },

    {
      itemBlueprintKey: HelmetsBlueprint.SaviorsHelmet,
      chance: 5,
    },
    {
      itemBlueprintKey: SwordsBlueprint.CorruptionSword,
      chance: 5,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.RoyalKnightHelmet,
      chance: 5,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.SilverShield,
      chance: 30,
    },

    {
      itemBlueprintKey: SwordsBlueprint.ElvenSword,
      chance: 2.5,
    },

    {
      itemBlueprintKey: AccessoriesBlueprint.ElvenRing,
      chance: 1,
    },

    {
      itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
      chance: 20,
      quantityRange: [3, 10],
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.ElvenWood,
      chance: 20,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.ElvenLeaf,
      chance: 20,
      quantityRange: [5, 10],
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.Herb,
      chance: 30,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: BootsBlueprint.KnightBoots,
      chance: 10,
    },
  ],
};
