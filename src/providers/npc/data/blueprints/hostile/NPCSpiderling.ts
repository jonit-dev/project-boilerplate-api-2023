import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { FoodsBlueprint, GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSpiderling: Partial<INPC> = {
  ...generateMoveTowardsMovement(),
  name: "Spiderling",
  subType: NPCSubtype.Insect,
  key: HostileNPCsBlueprint.Spiderling,
  textureKey: HostileNPCsBlueprint.Spiderling,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 60,
  healthRandomizerDice: Dice.D4,
  skills: {
    level: 3,
    strength: {
      level: 3,
    },
    dexterity: {
      level: 4,
    },
    resistance: {
      level: 1,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: GlovesBlueprint.StuddedGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Banana,
      chance: 20,
      quantityRange: [1, 3],
    },
  ],
};
