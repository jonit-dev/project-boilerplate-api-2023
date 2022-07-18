import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcMinotaur = {
  ...generateMoveTowardsMovement(),
  name: "Minotaur",
  key: "minotaur",
  textureKey: "minotaur",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 5,
  skills: {
    level: 3,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 2,
    },
    resistance: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  experience: 80,
  loots: [
    {
      itemBlueprintKey: "dragon's-sword",
      chance: 35,
    },
  ],
} as Partial<INPC>;
