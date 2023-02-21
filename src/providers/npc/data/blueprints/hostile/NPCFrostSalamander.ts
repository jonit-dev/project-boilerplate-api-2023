import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  CraftingResourcesBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SpearsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFrostSalamander: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Frost Salamander",
  key: HostileNPCsBlueprint.FrostSalamander,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.FrostSalamander,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Fast,
  baseHealth: 110,
  healthRandomizerDice: Dice.D12,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  skills: {
    level: 5,
    strength: {
      level: 7,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 8,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 20,
    },
    {
      itemBlueprintKey: PotionsBlueprint.ManaPotion,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.IceSword,
      chance: 10,
    },
    {
      itemBlueprintKey: SwordsBlueprint.DoubleEdgedSword,
      chance: 15,
    },
    {
      itemBlueprintKey: SpearsBlueprint.RoyalSpear,
      chance: 5,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Bolt,
      chance: 20,
      quantityRange: [10, 13],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.CompoundBow,
      chance: 5,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.FrostCrossbow,
      chance: 5,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.VikingShield,
      chance: 10,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.BlueSilk,
      chance: 20,
      quantityRange: [1, 5],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Freezing],
};
