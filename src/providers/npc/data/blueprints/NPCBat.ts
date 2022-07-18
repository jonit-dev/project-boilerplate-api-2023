import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../abstractions/BaseNeutralNPC";

export const npcBat = {
  ...generateMoveTowardsMovement(),
  name: "Bat",
  key: "bat",
  textureKey: "bat",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 7,
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
  experience: 15,
  loots: [
    {
      itemBlueprintKey: "greater-life-potion",
      chance: 75,
    },
  ],
} as Partial<INPC>;
