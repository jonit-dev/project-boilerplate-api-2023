import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  OthersBlueprint,
  PotionsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBat = {
  ...generateMoveTowardsMovement(),
  name: "Bat",
  key: HostileNPCsBlueprint.Bat,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.Bat,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 29,
  skills: {
    level: 1,
    strength: {
      level: 1,
    },
    dexterity: {
      level: 1,
    },
    resistance: {
      level: 1,
    },
  },
  loots: [
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 30,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 15,
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
} as Partial<INPC>;
