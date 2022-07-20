import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcRat = {
  ...generateMoveTowardsMovement(),
  name: "Rat",
  key: "rat",
  textureKey: "rat",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 1.5,
  skills: {
    level: 1,
    strength: {
      level: 1,
    },
    dexterity: {
      level: 1,
    },
    resistance: {
      level: 2,
    },
  },
  fleeOnLowHealth: true,
  experience: 15,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Cheese,
      chance: 30,
      quantityRange: [1, 3],
    },
  ],
} as Partial<INPC>;
