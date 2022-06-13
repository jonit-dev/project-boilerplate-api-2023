import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcRat = {
  ...generateMoveTowardsMovement(),
  name: "Rat",
  key: "rat",
  textureKey: "rat",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 2,
  skills: {
    level: 1,
    strength: 1,
    dexterity: 3,
  },
  fleeOnLowHealth: true,
} as Partial<INPC>;
