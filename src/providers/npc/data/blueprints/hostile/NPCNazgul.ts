import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  ArmorsBlueprint,
  BootsBlueprint,
  DaggersBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { AnimationEffectKeys, MagicPower, NPCAlignment, RangeTypes, SpellsBlueprint } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcNazgul: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Obsidia Nightguard",
  key: HostileNPCsBlueprint.Nazgul,
  textureKey: HostileNPCsBlueprint.Nazgul,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  speed: MovementSpeed.Fast,
  ammoKey: AnimationEffectKeys.Dark,
  maxRangeAttack: RangeTypes.High,
  baseHealth: 6000,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 150,
    strength: {
      level: 150,
    },
    dexterity: {
      level: 70,
    },
    resistance: {
      level: 110,
    },
    magicResistance: {
      level: 120,
    },
  },
  loots: [
    {
      itemBlueprintKey: SwordsBlueprint.LeviathanSword,
      chance: 5,
    },
    {
      itemBlueprintKey: DaggersBlueprint.PhoenixDagger,
      chance: 10,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.GoldenArmor,
      chance: 5,
    },
    {
      itemBlueprintKey: HammersBlueprint.SilverHammer,
      chance: 5,
    },
    {
      itemBlueprintKey: BootsBlueprint.GoldenBoots,
      chance: 2,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.RoyalHelmet,
      chance: 30,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding, EntityEffectBlueprint.Corruption],
  areaSpells: [
    {
      spellKey: SpellsBlueprint.CorruptionWave,
      probability: 5,
      power: MagicPower.UltraHigh,
    },
  ],
};
