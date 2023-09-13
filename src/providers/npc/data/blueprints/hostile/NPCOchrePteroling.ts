import { INPC } from "@entities/ModuleNPC/NPCModel";
import { Dice } from "@providers/constants/DiceConstants";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcOchrePteroling = {
  ...generateMoveTowardsMovement(),
  name: "Ochre Pteroling",
  key: HostileNPCsBlueprint.OchrePteroling,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.OchrePteroling,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 80,
  healthRandomizerDice: Dice.D6,
  canSwitchToRandomTarget: true,
  skills: {
    level: 8,
    strength: {
      level: 8,
    },
    dexterity: {
      level: 5,
    },
    resistance: {
      level: 5,
    },
  },
  fleeOnLowHealth: true,
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.BananaBunch,
      chance: 15,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Egg,
      chance: 5,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Jade,
      chance: 20,
      quantityRange: [1, 2],
    },
    {
      itemBlueprintKey: FoodsBlueprint.RedMushroom,
      chance: 15,
      quantityRange: [1, 2],
    },
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
} as Partial<INPC>;
