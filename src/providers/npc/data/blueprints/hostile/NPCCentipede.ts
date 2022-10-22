import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EXP_RATIO } from "@providers/constants/SkillConstants";
import { BootsBlueprint, FoodsBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcCentipede: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Centipede",
  key: HostileNPCsBlueprint.Centipede,
  textureKey: HostileNPCsBlueprint.Centipede,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 30,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 5,
    strength: {
      level: 7,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 5,
    },
  },
  fleeOnLowHealth: true,
  experience: 30 * EXP_RATIO,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.ReforcedBoots,
      chance: 30,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Bread,
      chance: 25,
    },
    {
      itemBlueprintKey: FoodsBlueprint.BananaBunch,
      chance: 25,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Apple,
      chance: 25,
    },
    {
      itemBlueprintKey: RangedWeaponsBlueprint.Arrow,
      chance: 20,
      quantityRange: [3, 10],
    },
  ],
};
