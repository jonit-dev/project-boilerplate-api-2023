import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import {
  ArmorsBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  GlovesBlueprint,
  HelmetBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcOrcBerserker = {
  ...generateMoveTowardsMovement(),
  name: "Orc Berserker",
  key: HostileNPCsBlueprint.OrcBerserker,
  textureKey: HostileNPCsBlueprint.OrcBerserker,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 98,
  healthRandomizerDice: Dice.D4,
  skillRandomizerDice: Dice.D4,
  skillsToBeRandomized: ["level", "strength", "dexterity"],
  canSwitchToLowHealthTarget: true,
  skills: {
    level: 12,
    strength: {
      level: 10,
    },
    dexterity: {
      level: 7,
    },
  },
  fleeOnLowHealth: true,
  experience: 60 * EXP_RATIO,
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
      itemBlueprintKey: HelmetBlueprint.StuddedHelmet,
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
  ],
} as Partial<INPC>;
