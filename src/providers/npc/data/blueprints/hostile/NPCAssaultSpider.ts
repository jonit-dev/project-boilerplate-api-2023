import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";

import {
  AccessoriesBlueprint,
  DaggersBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  OthersBlueprint,
  PotionsBlueprint,
  SpearsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcAssaultSpider: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Assault Spider",
  key: HostileNPCsBlueprint.AssaultSpider,
  textureKey: HostileNPCsBlueprint.AssaultSpider,
  subType: NPCSubtype.Insect,

  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 60,
  healthRandomizerDice: Dice.D6,
  skills: {
    level: 7,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 2,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      chance: 30,
      quantityRange: [3, 10],
    },
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 20,
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 5,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.DarkWizardHat,
      chance: 20,
    },
    {
      itemBlueprintKey: StaffsBlueprint.CorruptionStaff,
      chance: 5,
    },
    {
      itemBlueprintKey: DaggersBlueprint.CorruptionDagger,
      chance: 15,
    },
    {
      itemBlueprintKey: SwordsBlueprint.Katana,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 2.5,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.CorruptionNecklace,
      chance: 10,
    },
  ],
};
