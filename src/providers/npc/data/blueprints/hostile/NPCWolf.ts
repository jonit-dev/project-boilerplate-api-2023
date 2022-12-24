import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  FoodsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcWolf = {
  ...generateMoveTowardsMovement(),
  name: "Wolf",
  key: HostileNPCsBlueprint.Wolf,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.Wolf,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 55,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 2,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 1,
    },
    resistance: {
      level: 1,
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
      itemBlueprintKey: DaggersBlueprint.Dagger,
      chance: 30,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.WolfTooth,
      chance: 50,
      quantityRange: [1, 2],
    },
  ],
} as Partial<INPC>;
