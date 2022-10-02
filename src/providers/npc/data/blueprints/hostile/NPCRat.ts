import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcRat = {
  ...generateMoveTowardsMovement(),
  name: "Rat",
  key: HostileNPCsBlueprint.Rat,
  textureKey: HostileNPCsBlueprint.Rat,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 25,
  healthRandomizerDice: Dice.D4,
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
  experience: 3 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Cheese,
      chance: 30,
      quantityRange: [1, 3],
    },
  ],
} as Partial<INPC>;
