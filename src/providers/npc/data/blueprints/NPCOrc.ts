import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcOrc = {
  ...generateMoveTowardsMovement(),
  name: "Orc",
  key: "orc",
  textureKey: "orc",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 3,
  skills: {
    level: 1,
    strength: 2,
    dexterity: 3,
  },
  fleeOnLowHealth: true,
} as Partial<INPC>;
