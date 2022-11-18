import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  AxesBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  OthersBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcIceFox: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Ice Fox",
  key: HostileNPCsBlueprint.IceFox,
  textureKey: HostileNPCsBlueprint.IceFox,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 150,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 17,
    strength: {
      level: 20,
    },
    dexterity: {
      level: 25,
    },
    resistance: {
      level: 15,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 40,
      quantityRange: [25, 50],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.FrostBow,
      chance: 20,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.FrostCrossbow,
      chance: 5,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
      chance: 50,
      quantityRange: [10, 20],
    },
    {
      itemBlueprintKey: ShieldsBlueprint.FrostShield,
      chance: 20,
    },
    {
      itemBlueprintKey: AxesBlueprint.FrostDoubleAxe,
      chance: 5,
    },
    {
      itemBlueprintKey: GlovesBlueprint.ChainGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: DaggersBlueprint.FrostDagger,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Silk,
      chance: 30,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 1,
    },
    {
      itemBlueprintKey: FoodsBlueprint.IceMushroom,
      chance: 10,
      quantityRange: [3, 4],
    },
  ],
};
