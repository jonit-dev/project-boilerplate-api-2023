import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import { BootsBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcOrc = {
  ...generateMoveTowardsMovement(),
  name: "Orc",
  key: HostileNPCsBlueprint.Orc,
  textureKey: HostileNPCsBlueprint.Orc,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 64,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 3,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 3,
    },
  },
  fleeOnLowHealth: true,
  experience: 14 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
    },

    {
      itemBlueprintKey: MacesBlueprint.SpikedClub,
      chance: 10,
    },
  ],
} as Partial<INPC>;
