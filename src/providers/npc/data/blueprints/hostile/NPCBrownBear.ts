import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBrownBear = {
  ...generateMoveTowardsMovement(),
  name: "Brown Bear",
  key: HostileNPCsBlueprint.BrownBear,
  textureKey: HostileNPCsBlueprint.BrownBear,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.Standard,
  baseHealth: 80,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 8,
    strength: {
      level: 9,
    },
    dexterity: {
      level: 6,
    },
    resistance: {
      level: 5,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Fish,
      chance: 30,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 20,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Leather,
      chance: 50,
      quantityRange: [5, 10],
    },
  ],
} as Partial<INPC>;
