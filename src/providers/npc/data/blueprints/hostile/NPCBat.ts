import { INPC } from "@entities/ModuleNPC/NPCModel";
import { FoodsBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { HostileNPCsBlueprint } from "@providers/item/data/types/npcsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcBat = {
  ...generateMoveTowardsMovement(),
  name: "Bat",
  key: HostileNPCsBlueprint.Bat,
  textureKey: HostileNPCsBlueprint.Bat,
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 4,
  skills: {
    level: 1,
    strength: {
      level: 1,
    },
    dexterity: {
      level: 1,
    },
    resistance: {
      level: 1,
    },
  },
  experience: 15,
  loots: [
    {
      itemBlueprintKey: PotionsBlueprint.GreaterLifePotion,
      chance: 15,
    },
    {
      itemBlueprintKey: FoodsBlueprint.Banana,
      chance: 30,
    },
  ],
} as Partial<INPC>;
