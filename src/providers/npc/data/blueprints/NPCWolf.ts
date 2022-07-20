import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcWolf = {
  ...generateMoveTowardsMovement(),
  name: "Wolf",
  key: "wolf",
  textureKey: "wolf",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 6,
  skills: {
    level: 1,
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
  experience: 40,
  loots: [
    {
      itemBlueprintKey: "dagger",
      chance: 30,
    },
  ],
} as Partial<INPC>;
