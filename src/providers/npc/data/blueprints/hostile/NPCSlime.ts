import { INPC } from "@entities/ModuleNPC/NPCModel";
import { GlovesBlueprint, HelmetBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcSlime = {
  ...generateMoveTowardsMovement(),
  name: "Slime",
  key: "slime",
  textureKey: "slime",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 3,
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
  fleeOnLowHealth: true,
  experience: 15,
  loots: [
    {
      itemBlueprintKey: GlovesBlueprint.LeatherGloves,
      chance: 10,
    },
    {
      itemBlueprintKey: PotionsBlueprint.LightLifePotion,
      chance: 20,
    },
    {
      itemBlueprintKey: HelmetBlueprint.WingHelmet,
      chance: 5,
    },
  ],
} as Partial<INPC>;
