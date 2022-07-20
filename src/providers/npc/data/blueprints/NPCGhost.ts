import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcGhost = {
  ...generateMoveTowardsMovement(),
  name: "Ghost",
  key: "ghost",
  textureKey: "ghost",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 5,
  skills: {
    level: 1,
    strength: {
      level: 1,
    },
    dexterity: {
      level: 1,
    },
    resistance: {
      level: 1,
    },
  },
  fleeOnLowHealth: true,
  experience: 50,
  loots: [
    {
      itemBlueprintKey: "arrow",
      chance: 45,
    },
  ],
} as Partial<INPC>;
