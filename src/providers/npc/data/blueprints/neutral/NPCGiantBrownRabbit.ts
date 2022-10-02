import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NeutralNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveAwayMovement } from "../../abstractions/BaseNeutralNPC";

export const npcGiantBrownRabbit = {
  ...generateMoveAwayMovement(),
  name: "Giant Rabbit",
  key: NeutralNPCsBlueprint.GiantBrownRabbit,
  textureKey: NeutralNPCsBlueprint.GiantBrownRabbit,
  alignment: NPCAlignment.Neutral,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 50,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 3,
    strength: {
      level: 4,
    },
    dexterity: {
      level: 10,
    },
    resistance: {
      level: 3,
    },
  },
  experience: 40,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Apple,
      chance: 50,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Banana,
      chance: 25,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Cookie,
      chance: 20,
    },
  ],
} as Partial<INPC>;
