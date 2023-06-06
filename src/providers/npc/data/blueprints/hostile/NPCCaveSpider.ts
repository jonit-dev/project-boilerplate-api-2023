import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AccessoriesBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  PotionsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcCaveSpider: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Cave Spider",
  key: HostileNPCsBlueprint.CaveSpider,
  subType: NPCSubtype.Insect,
  textureKey: HostileNPCsBlueprint.CaveSpider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 80,
  healthRandomizerDice: Dice.D6,
  skills: {
    level: 20,
    strength: {
      level: 9,
    },
    dexterity: {
      level: 6,
    },
    resistance: {
      level: 5,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Herb,
      chance: 30,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 5,
    },
    {
      itemBlueprintKey: SwordsBlueprint.BroadSword,
      chance: 15,
    },
    {
      itemBlueprintKey: StaffsBlueprint.CorruptionStaff,
      chance: 10,
    },
    {
      itemBlueprintKey: AxesBlueprint.Bardiche,
      chance: 5,
    },
    {
      itemBlueprintKey: BootsBlueprint.Sandals,
      chance: 20,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.DeathsHelmet,
      chance: 5,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.DeathNecklace,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.SewingThread,
      chance: 10,
      quantityRange: [1, 3],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Poison],
};
