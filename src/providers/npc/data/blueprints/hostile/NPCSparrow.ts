import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  PotionsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSparrow: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Sparrow",
  key: HostileNPCsBlueprint.Sparrow,
  subType: NPCSubtype.Bird,
  textureKey: HostileNPCsBlueprint.Sparrow,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 40,
  healthRandomizerDice: Dice.D12,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 4,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 8,
    },
    resistance: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 50,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Feather,
      chance: 50,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Worm,
      chance: 50,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.BlueFeather,
      chance: 20,
      quantityRange: [5, 10],
    },
  ],
};
