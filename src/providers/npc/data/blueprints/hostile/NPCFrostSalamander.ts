import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  PotionsBlueprint,
  RangedBlueprint,
  SpearsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFrostSalamander: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Frost Salamander",
  key: HostileNPCsBlueprint.FrostSalamander,
  textureKey: HostileNPCsBlueprint.FrostSalamander,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 110,
  healthRandomizerDice: Dice.D12,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 5,
    strength: {
      level: 7,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 8,
    },
  },
  fleeOnLowHealth: true,
  experience: 100 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 20,
    },
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.DoubleEdgedSword,
      chance: 15,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 5,
    },
    {
      itemBlueprintKey: RangedBlueprint.Bolt,
      chance: 20,
      quantityRange: [10, 13],
    },
    {
      itemBlueprintKey: RangedBlueprint.Crossbow,
      chance: 20,
    },
  ],
};