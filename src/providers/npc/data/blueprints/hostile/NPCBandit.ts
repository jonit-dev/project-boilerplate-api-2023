import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  AccessoriesBlueprint,
  AxesBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  MacesBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { FriendlyNPCsBlueprint, HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBandit: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Bandit",
  key: HostileNPCsBlueprint.Bandit,
  textureKey: FriendlyNPCsBlueprint.MaleNobleBlackHair,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 50,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 4,
    strength: {
      level: 4,
    },
    dexterity: {
      level: 3,
    },
    resistance: {
      level: 4,
    },
  },
  fleeOnLowHealth: true,

  loots: [
    {
      itemBlueprintKey: SwordsBlueprint.BroadSword,
      chance: 5,
    },
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 20,
    },
    {
      itemBlueprintKey: GlovesBlueprint.StuddedGloves,
      chance: 20,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.LeatherHelmet,
      chance: 20,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.RedHoodie,
      chance: 30,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.Turban,
      chance: 30,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },
    {
      itemBlueprintKey: LegsBlueprint.LeatherLegs,
      chance: 15,
    },
    {
      itemBlueprintKey: AxesBlueprint.Bardiche,
      chance: 5,
    },
    {
      itemBlueprintKey: AxesBlueprint.Halberd,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Silk,
      chance: 30,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.Bandana,
      chance: 30,
    },
  ],
};
