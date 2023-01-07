import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import {
  AccessoriesBlueprint,
  ContainersBlueprint,
  FoodsBlueprint,
  GlovesBlueprint,
  HelmetsBlueprint,
  MacesBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDwarfGuardian: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Dwarf Guardian",
  key: HostileNPCsBlueprint.DwarfGuardian,
  textureKey: HostileNPCsBlueprint.DwarfGuardian,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 150,
  healthRandomizerDice: Dice.D12,
  canSwitchToRandomTarget: true,
  skills: {
    level: 18,
    strength: {
      level: 18,
    },
    dexterity: {
      level: 10,
    },
    resistance: {
      level: 10,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: ContainersBlueprint.Backpack,
      chance: 10,
    },

    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 25,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.ScutumShield,
      chance: 10,
    },
    {
      itemBlueprintKey: GlovesBlueprint.ChainGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 30,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.IronArrow,
      chance: 50,
      quantityRange: [10, 30],
    },
    {
      itemBlueprintKey: MacesBlueprint.SpikedMace,
      chance: 7,
    },

    {
      itemBlueprintKey: HelmetsBlueprint.GladiatorHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 30,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.RubyRing,
      chance: 2,
    },
    {
      itemBlueprintKey: SpearsBlueprint.Corseque,
      chance: 10,
    },
    {
      itemBlueprintKey: StaffsBlueprint.RoyalStaff,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.EnchantedSword,
      chance: 15,
    },
  ],
};
