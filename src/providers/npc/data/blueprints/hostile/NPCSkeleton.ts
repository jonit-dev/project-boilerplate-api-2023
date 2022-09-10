import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  HelmetBlueprint,
  MacesBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSkeleton = {
  ...generateMoveTowardsMovement(),
  name: "Skeleton",
  key: HostileNPCsBlueprint.Skeleton,
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
  },
  fleeOnLowHealth: true,
  experience: 9 * EXP_RATIO,
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
      itemBlueprintKey: HelmetBlueprint.Cap,
      chance: 30,
    },
    {
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
    },
  ],
} as Partial<INPC>;
