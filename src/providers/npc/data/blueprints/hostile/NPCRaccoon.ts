import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcRaccoon: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Raccoon",
  key: HostileNPCsBlueprint.Raccoon,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.Raccoon,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 40,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 1,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 2,
    },
    resistance: {
      level: 2,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.WildSalmon,
      chance: 20,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: FoodsBlueprint.Egg,
      chance: 10,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: FoodsBlueprint.Blueberry,
      chance: 30,
    },
    {
      itemBlueprintKey: SwordsBlueprint.ShortSword,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Leather,
      chance: 50,
      quantityRange: [1, 3],
    },
  ],
};
