import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcIceTroll: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Ice Troll",
  key: HostileNPCsBlueprint.IceTroll,
  textureKey: HostileNPCsBlueprint.IceTroll,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 180,
  healthRandomizerDice: Dice.D20,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  canSwitchToRandomTarget: true,
  skills: {
    level: 15,
    strength: {
      level: 14,
    },
    dexterity: {
      level: 3,
    },
    resistance: {
      level: 10,
    },
  },
  fleeOnLowHealth: true,
  experience: 160 * EXP_RATIO,
  loots: [
    // add your loots here
  ],
};
