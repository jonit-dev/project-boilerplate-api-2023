import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  ArmorsBlueprint,
  CraftingResourcesBlueprint,
  GlovesBlueprint,
  HelmetsBlueprint,
  RangedWeaponsBlueprint,
  StaffsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcFireFox: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Fire Fox",
  key: HostileNPCsBlueprint.FireFox,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.FireFox,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 150,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 30,
    strength: {
      level: 25,
    },
    dexterity: {
      level: 25,
    },
    resistance: {
      level: 20,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: SwordsBlueprint.FireSword,
      chance: 20,
    },
    {
      itemBlueprintKey: StaffsBlueprint.FireStaff,
      chance: 10,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.PlateArmor,
      chance: 2,
    },
    {
      itemBlueprintKey: GlovesBlueprint.ChainGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: HelmetsBlueprint.VikingHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Leather,
      chance: 40,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.FireBolt,
      chance: 10,
      quantityRange: [2, 5],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.MagicRecipe,
      chance: 20,
      quantityRange: [1, 5],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.PhoenixFeather,
      chance: 5,
      quantityRange: [5, 10],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Burning],
};
