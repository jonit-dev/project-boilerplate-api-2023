import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  BowsBlueprint,
  ShieldsBlueprint,
  SwordBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSkeletonKnight = {
  ...generateMoveTowardsMovement(),
  name: "Skeleton Knight",
  key: HostileNPCsBlueprint.SkeletonKnight,
  textureKey: HostileNPCsBlueprint.SkeletonKnight,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 137,
  healthRandomizerDice: Dice.D4,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 2,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 2,
    },
    resistence: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  experience: 12 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: ArmorsBlueprint.StuddedArmor,
      chance: 25,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.StuddedShield,
      chance: 30,
    },
    {
      itemBlueprintKey: SwordBlueprint.DoubleEdgedSword,
      chance: 5,
    },

    {
      itemBlueprintKey: BootsBlueprint.StuddedBoots,
      chance: 25,
    },
    {
      itemBlueprintKey: BowsBlueprint.Bow,
      chance: 10,
    },
  ],
} as Partial<INPC>;
