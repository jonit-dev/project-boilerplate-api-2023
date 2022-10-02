import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NeutralNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveAwayMovement } from "../../abstractions/BaseNeutralNPC";

export const npcPig = {
  ...generateMoveAwayMovement(),
  name: "Pig",
  key: NeutralNPCsBlueprint.Pig,
  textureKey: NeutralNPCsBlueprint.Pig,
  alignment: NPCAlignment.Neutral,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraSlow,
  baseHealth: 20,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 2,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 2,
    },
    resistance: {
      level: 3,
    },
  },
  experience: 25,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 50,
    },
  ],
} as Partial<INPC>;
