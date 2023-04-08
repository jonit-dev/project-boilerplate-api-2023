import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  HelmetsBlueprint,
  MacesBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSkeleton = {
  ...generateMoveTowardsMovement(),
  name: "Skeleton",
  key: HostileNPCsBlueprint.Skeleton,
  subType: NPCSubtype.Undead,
  textureKey: HostileNPCsBlueprint.Skeleton,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 58,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 5,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 2,
    },
    resistance: {
      level: 1,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: ArmorsBlueprint.Jacket,
      chance: 30,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.Coat,
      chance: 20,
    },
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 20,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.LeatherJacket,
      chance: 15,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.Cap,
      chance: 30,
    },
    {
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Stone,
      chance: 10,
      quantityRange: [2, 3],
    },

    {
      itemBlueprintKey: RangedWeaponsBlueprint.EldensBow,
      chance: 7,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.IronNail,
      chance: 30,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Bone,
      chance: 30,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Skull,
      chance: 20,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.WaterBottle,
      chance: 20,
      quantityRange: [2, 3],
    },
  ],
} as Partial<INPC>;
