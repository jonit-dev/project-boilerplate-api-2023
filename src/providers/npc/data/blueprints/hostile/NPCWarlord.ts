import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AccessoriesBlueprint,
  DaggersBlueprint,
  FoodsBlueprint,
  HelmetsBlueprint,
  RangedWeaponsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { MagicPower, NPCAlignment, RangeTypes, SpellsBlueprint } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcWarlord: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Warlord",
  key: HostileNPCsBlueprint.Warlord,
  textureKey: "warlord",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.MeleeRanged,
  speed: MovementSpeed.ExtraFast,
  ammoKey: RangedWeaponsBlueprint.Bolt,
  maxRangeAttack: RangeTypes.High,
  baseHealth: 2000,
  healthRandomizerDice: Dice.D20,
  canSwitchToRandomTarget: true,
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 100,
    strength: {
      level: 120,
    },
    dexterity: {
      level: 90,
    },
    resistance: {
      level: 130,
    },
    magicResistance: {
      level: 120,
    },
  },
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Cookie,
      chance: 75,
      quantityRange: [1, 10],
    },

    {
      itemBlueprintKey: DaggersBlueprint.VerdantDagger,
      chance: 25,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.VikingHelmet,
      chance: 10,
    },

    {
      itemBlueprintKey: SwordsBlueprint.LightingSword,
      chance: 15,
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.RubyRing,
      chance: 10,
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
