import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  HelmetsBlueprint,
  OthersBlueprint,
  PotionsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcGiantBat: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Giant Bat",
  key: HostileNPCsBlueprint.GiantBat,
  textureKey: HostileNPCsBlueprint.GiantBat,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 64,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 7,
    strength: {
      level: 7,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 7,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 30,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 15,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.DeathsHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Banana,
      chance: 30,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.BatsWing,
      chance: 50,
      quantityRange: [1, 3],
    },
  ],
};
