import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  LegsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSpider = {
  ...generateMoveTowardsMovement(),
  name: "Spider",
  subType: NPCSubtype.Insect,
  key: HostileNPCsBlueprint.Spider,
  textureKey: HostileNPCsBlueprint.Spider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 49,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 0.5,
    strength: {
      level: 1,
    },
    dexterity: {
      level: 2,
    },
    resistance: {
      level: 1,
    },
  },
  loots: [
    {
      itemBlueprintKey: GlovesBlueprint.LeatherGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: LegsBlueprint.LeatherLegs,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Banana,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.SewingThread,
      chance: 10,
      quantityRange: [1, 3],
    },
  ],
} as Partial<INPC>;
