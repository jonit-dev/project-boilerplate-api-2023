import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
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
    level: 3,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 1,
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
  ],
} as Partial<INPC>;
