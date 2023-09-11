import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  ArmorsBlueprint,
  AxesBlueprint,
  BooksBlueprint,
  BootsBlueprint,
  ContainersBlueprint,
  CraftingResourcesBlueprint,
  GlovesBlueprint,
  HelmetsBlueprint,
  MacesBlueprint,
  MagicsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { MagicPower, NPCAlignment, SpellsBlueprint } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcDwarfMage: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Dwarf Mage",
  key: HostileNPCsBlueprint.DwarfMage,
  textureKey: HostileNPCsBlueprint.DwarfMage,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Ranged,
  ammoKey: "fireball",
  maxRangeAttack: 10,
  speed: MovementSpeed.Slow,
  baseHealth: 140,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 45,
    strength: {
      level: 32,
    },
    dexterity: {
      level: 12,
    },
    resistance: {
      level: 7,
    },
    magicResistance: {
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
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
    },
    {
      itemBlueprintKey: AxesBlueprint.Axe,
      chance: 30,
    },

    {
      itemBlueprintKey: AxesBlueprint.HellishAxe,
      chance: 7,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.StuddedHelmet,
      chance: 15,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.StuddedArmor,
      chance: 15,
    },
    {
      itemBlueprintKey: BootsBlueprint.StuddedBoots,
      chance: 15,
    },
    {
      itemBlueprintKey: GlovesBlueprint.StuddedGloves,
      chance: 15,
    },
    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 10,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Bow,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Diamond,
      chance: 1,
    },
    {
      itemBlueprintKey: BooksBlueprint.Book,
      chance: 10,
    },
    {
      itemBlueprintKey: MagicsBlueprint.Rune,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.EldensSword,
      chance: 2,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Wheat,
      chance: 20,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: MagicsBlueprint.FireRune,
      chance: 20,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: ShieldsBlueprint.IronHeartShield,
      chance: 3,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Burning],
  areaSpells: [
    {
      spellKey: SpellsBlueprint.FireStorm,
      probability: 5,
      power: MagicPower.Low,
    },
    {
      spellKey: SpellsBlueprint.Blizzard,
      probability: 5,
      power: MagicPower.Low,
    },
  ],
};
