import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  ArmorsBlueprint,
  AxesBlueprint,
  BooksBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  GlovesBlueprint,
  HelmetsBlueprint,
  MacesBlueprint,
  MagicsBlueprint,
  RangedWeaponsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcOrcMage = {
  ...generateMoveTowardsMovement(),
  name: "Orc Mage",
  key: HostileNPCsBlueprint.OrcMage,
  textureKey: HostileNPCsBlueprint.OrcMage,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Ranged,
  ammoKey: "fireball",
  maxRangeAttack: 8,
  speed: MovementSpeed.Standard,
  baseHealth: 120,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 20,
    strength: {
      level: 15,
    },
    dexterity: {
      level: 8,
    },
    resistance: {
      level: 4,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
    },
    {
      itemBlueprintKey: AxesBlueprint.Axe,
      chance: 30,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.BlueSapphire,
      chance: 30,
      quantityRange: [1, 3],
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.RedSapphire,
      chance: 30,
      quantityRange: [1, 3],
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
      itemBlueprintKey: StaffsBlueprint.PoisonWand,
      chance: 15,
    },
    {
      itemBlueprintKey: StaffsBlueprint.FireStaff,
      chance: 5,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.AmethystHelmet,
      chance: 5,
    },
    {
      itemBlueprintKey: StaffsBlueprint.CorruptionStaff,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Jade,
      chance: 10,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Herb,
      chance: 40,
      quantityRange: [5, 10],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Burning],
} as Partial<INPC>;
