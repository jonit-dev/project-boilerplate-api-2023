import { INPC } from "@entities/ModuleNPC/NPCModel";
import {
  ArmorsBlueprint,
  AxesBlueprint,
  BootsBlueprint,
  HelmetBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { generateMoveTowardsMovement } from "../../abstractions/BaseNeutralNPC";

export const npcOrc = {
  ...generateMoveTowardsMovement(),
  name: "Orc",
  key: "orc",
  textureKey: "orc",
  alignment: NPCAlignment.Hostile,
  attackType: EntityAttackType.Melee,
  speed: 2,
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
  experience: 70,
  loots: [
    {
      itemBlueprintKey: BootsBlueprint.Boots,
      chance: 30,
    },
    {
      itemBlueprintKey: AxesBlueprint.Axe,
      chance: 30,
    },
    {
      itemBlueprintKey: HelmetBlueprint.StuddedHelmet,
      chance: 15,
    },
    {
      itemBlueprintKey: ArmorsBlueprint.StuddedArmor,
      chance: 15,
    },
  ],
} as Partial<INPC>;
