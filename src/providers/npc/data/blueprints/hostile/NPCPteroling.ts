import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcPteroling = {
  ...generateMoveTowardsMovement(),
  name: "Pteroling",
  key: HostileNPCsBlueprint.Pteroling,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.Pteroling,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 85,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 10,
    strength: {
      level: 10,
    },
    dexterity: {
      level: 6,
    },
    resistance: {
      level: 6,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.Cheese,
      chance: 10,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Salmon,
      chance: 15,
    },
    {
      itemBlueprintKey: FoodsBlueprint.RedMeat,
      chance: 5,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: FoodsBlueprint.Egg,
      chance: 15,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Leather,
      chance: 20,
      quantityRange: [5, 10],
    },
    {
      itemBlueprintKey: FoodsBlueprint.IceMushroom,
      chance: 5,
      quantityRange: [1, 2],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
