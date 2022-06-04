import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcSkeleton = {
  ...generateMoveTowardsMovement(),
  name: "Skeleton",
  key: "skeleton",
  textureKey: "skeleton",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 3,
  skills: {
    level: 1,
    strength: 2,
    dexterity: 1,
  },
  fleeOnLowHealth: true,
} as Partial<INPC>;
