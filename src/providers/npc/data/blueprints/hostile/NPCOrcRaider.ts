import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AccessoriesBlueprint,
  BootsBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcOrcRaider = {
  ...generateMoveTowardsMovement(),
  name: "Orc Raider",
  key: HostileNPCsBlueprint.OrcRaider,
  textureKey: HostileNPCsBlueprint.OrcRaider,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 180,
  healthRandomizerDice: Dice.D6,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity"],
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 15,
    strength: {
      level: 15,
    },
    dexterity: {
      level: 10,
    },
    resistance: {
      level: 20,
    },
  },
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.ReforcedBoots,
      chance: 10,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.GreenOre,
      chance: 10,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: AccessoriesBlueprint.OrcRing,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.RedSapphire,
      chance: 20,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: DaggersBlueprint.AzureDagger,
      chance: 20,
    },
    {
      itemBlueprintKey: SwordsBlueprint.CopperBroadsword,
      chance: 5,
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
