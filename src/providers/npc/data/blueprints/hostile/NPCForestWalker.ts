import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  BootsBlueprint,
  ContainersBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcForestWalker: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Forest Walker",
  key: HostileNPCsBlueprint.ForestWalker,
  textureKey: HostileNPCsBlueprint.ForestWalker,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 220,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 17,
    strength: {
      level: 18,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 14,
    },
  },
  fleeOnLowHealth: true,

  loots: [
    {
      itemBlueprintKey: PotionsBlueprint.LightLifePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
      chance: 50,
      quantityRange: [10, 20],
    },
    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
    {
      itemBlueprintKey: ContainersBlueprint.Backpack,
      chance: 10,
    },
    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 15,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.VikingShield,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.FireBolt,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.WoodenSticks,
      chance: 30,
      quantityRange: [1, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.SmallWoodenStick,
      chance: 40,
      quantityRange: [5, 15],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.WoodenBoard,
      chance: 30,
      quantityRange: [1, 10],
    },
  ],
};
