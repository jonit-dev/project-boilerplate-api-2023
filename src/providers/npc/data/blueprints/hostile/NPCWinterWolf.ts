import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  FoodsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcWinterWolf: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Winter Wolf",
  key: HostileNPCsBlueprint.WinterWolf,
  textureKey: HostileNPCsBlueprint.WinterWolf,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 60,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 3,
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
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 20,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Bread,
      chance: 30,
    },
    {
      itemBlueprintKey: DaggersBlueprint.FrostDagger,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.WolfTooth,
      chance: 50,
      quantityRange: [3, 5],
    },
  ],
};
