import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { NPCAlignment, NPCSubtype } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcCaveBat = {
  ...generateMoveTowardsMovement(),
  name: "Cave Bat",
  key: HostileNPCsBlueprint.CaveBat,
  subType: NPCSubtype.Animal,
  textureKey: HostileNPCsBlueprint.CaveBat,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: MovementSpeed.ExtraFast,
  baseHealth: 35,
  skills: {
    level: 2,
    strength: {
      level: 2,
    },
    dexterity: {
      level: 1,
    },
    resistance: {
      level: 2,
    },
  },
  loots: [
    {
      itemBlueprintKey: FoodsBlueprint.RedMeat,
      chance: 30,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.BatsWing,
      chance: 50,
      quantityRange: [1, 3],
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Worm,
      chance: 15,
    },
    {
      itemBlueprintKey: CraftingResourcesBlueprint.Bones,
      chance: 15,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Coconut,
      chance: 10,
    },
  ],
} as Partial<INPC>;
