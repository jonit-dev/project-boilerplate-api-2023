import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NeutralNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveAwayMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDeer = {
  ...generateMoveAwayMovement(),
  name: "Deer",
  key: NeutralNPCsBlueprint.Deer,
  textureKey: NeutralNPCsBlueprint.Deer,
  alignment: NPCAlignment.Neutral,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 10,
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
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.RedMeat,
      chance: 10,
      quantityRange: [1, 2],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Leather,
      chance: 50,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: FoodsBlueprint.RawBeefSteak,
      chance: 30,
      quantityRange: [1, 3],
    },
  ],
} as Partial<INPC>;
