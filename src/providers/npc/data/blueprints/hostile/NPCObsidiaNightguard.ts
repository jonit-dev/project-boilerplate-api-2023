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
  RangedWeaponsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { MagicPower, NPCAlignment, RangeTypes, SpellsBlueprint } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcObsidiaNightguard: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Obsidia Nightguard",
  key: HostileNPCsBlueprint.ObsidiaNightguard,
  textureKey: "obsidia-nightguard",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  speed: MovementSpeed.Fast,
  ammoKey: RangedWeaponsBlueprint.Bolt,
  maxRangeAttack: RangeTypes.High,
  baseHealth: 1500,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 95,
    strength: {
      level: 120,
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
      chance: 15,
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
  entityEffects: [EntityEffectBlueprint.Bleeding, EntityEffectBlueprint.Freezing],
  areaSpells: [
    {
      spellKey: SpellsBlueprint.Arrowstorm,
      probability: 10,
      power: MagicPower.Medium,
    },
    {
      spellKey: SpellsBlueprint.Blizzard,
      probability: 5,
      power: MagicPower.High,
    },
  ],
};
