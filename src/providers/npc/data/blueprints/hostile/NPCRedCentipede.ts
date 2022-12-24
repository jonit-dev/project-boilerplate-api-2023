import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { FoodsBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcRedCentipede: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Red Centipede",
  key: HostileNPCsBlueprint.RedCentipede,
  subType: NPCSubtype.Insect,
  textureKey: HostileNPCsBlueprint.RedCentipede,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Slow,
  baseHealth: 45,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 7,
    strength: {
      level: 7,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 2,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Apple,
      chance: 50,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: HelmetsBlueprint.ArabicHelmet,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Banana,
      chance: 25,
      quantityRange: [1, 3],
    },
  ],
};
