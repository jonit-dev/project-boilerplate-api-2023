import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  ArmorsBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  FoodsBlueprint,
  HammersBlueprint,
  HelmetsBlueprint,
  PotionsBlueprint,
  RangedWeaponsBlueprint,
  ShieldsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcIceTroll: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Ice Troll",
  key: HostileNPCsBlueprint.IceTroll,
  textureKey: HostileNPCsBlueprint.IceTroll,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 350,
  healthRandomizerDice: Dice.D20,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity", "resistance"],
  canSwitchToRandomTarget: true,
  skills: {
    level: 40,
    strength: {
      level: 30,
    },
    dexterity: {
      level: 15,
    },
    resistance: {
      level: 30,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 20,
    },

    {
      itemBlueprintKey: SwordsBlueprint.IceSword,
      chance: 5,
    },
    {
      itemBlueprintKey: AxesBlueprint.FrostDoubleAxe,
      chance: 5,
    },
    {
      itemBlueprintKey: AxesBlueprint.DwarvenWaraxe,
      chance: 10,
    },
    {
      itemBlueprintKey: ShieldsBlueprint.FrostShield,
      chance: 15,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.FrostCrossbow,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },
    {
      itemBlueprintKey: BootsBlueprint.PlateBoots,
      chance: 10,
    },

    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 20,
    },
    {
      itemBlueprintKey: SwordsBlueprint.Saber,
      chance: 10,
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
      itemBlueprintKey: CraftingResourcesBlueprint.BlueLeather,
      chance: 10,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Rock,
      chance: 20,
      quantityRange: [1, 5],
    },

    {
      itemBlueprintKey: CraftingResourcesBlueprint.Skull,
      chance: 15,
      quantityRange: [1, 3],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding, EntityEffectBlueprint.Freezing],
};
