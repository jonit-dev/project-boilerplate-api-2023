import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NeutralNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveAwayMovement } from "../../abstractions/BaseNeutralNPC";

export const npcWhiteSheep = {
  ...generateMoveAwayMovement(),
  name: "Sheep",
  key: NeutralNPCsBlueprint.WhiteSheep,
  textureKey: NeutralNPCsBlueprint.WhiteSheep,
  alignment: NPCAlignment.Neutral,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 35,
  healthRandomizerDice: Dice.D6,
  skills: {
    level: 3,
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
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Bread,
      chance: 50,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Leather,
      chance: 50,
      quantityRange: [1, 3],
    },
  ],
} as Partial<INPC>;
