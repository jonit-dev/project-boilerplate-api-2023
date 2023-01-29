import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  ArmorsBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  ContainersBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  LegsBlueprint,
  PotionsBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcGiantSpider: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Giant Spider",
  key: HostileNPCsBlueprint.GiantSpider,
  subType: NPCSubtype.Insect,
  textureKey: HostileNPCsBlueprint.GiantSpider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 800,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 60,
    strength: {
      level: 45,
    },
    dexterity: {
      level: 40,
    },
    resistance: {
      level: 30,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: StaffsBlueprint.MoonsStaff,
      chance: 30,
    },
    {
      itemBlueprintKey: SwordsBlueprint.DragonsSword,
      chance: 5,
    },
    {
      itemBlueprintKey: ContainersBlueprint.Backpack,
      chance: 50,
    },

    {
      itemBlueprintKey: BootsBlueprint.CopperBoots,
      chance: 20,
    },
    {
      itemBlueprintKey: GlovesBlueprint.PlateGloves,
      chance: 85,
    },
    {
      itemBlueprintKey: LegsBlueprint.StuddedLegs,
      chance: 60,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.PlateShield,
      chance: 15,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.SoldiersHelmet,
      chance: 30,
    },
    {
      itemBlueprintKey: AxesBlueprint.DoubleAxe,
      chance: 15,
    },
    {
      itemBlueprintKey: AxesBlueprint.CorruptionAxe,
      chance: 15,
    },
    {
      itemBlueprintKey: HammersBlueprint.WarHammer,
      chance: 20,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 30,
    },

    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 80,
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 50,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.BronzeArmor,
      chance: 10,
    },
    {
      itemBlueprintKey: HammersBlueprint.WarHammer,
      chance: 10,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.InfantryHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: AxesBlueprint.Axe,
      chance: 30,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Poison],
};
