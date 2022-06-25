import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { armorsBlueprintsIndex } from "./blueprints/armors/index";
import { bodiesBlueprintsIndex } from "./blueprints/bodies/index";
import { containersBlueprintIndex } from "./blueprints/containers/index";
import { daggersBlueprintsIndex } from "./blueprints/daggers/index";
import { effectsBlueprintsIndex } from "./blueprints/effects/index";
import { helmetsBlueprintsIndex } from "./blueprints/helmets/index";
import { swordBlueprintIndex } from "./blueprints/swords/index";
import { axeBlueprintIndex } from "./blueprints/axes/index";
import { bootsBlueprintIndex } from "./blueprints/boots/index";
import { foodsBlueprintIndex } from "./blueprints/foods/index";

export const itemsBlueprintIndex: IBlueprint = {
  ...bodiesBlueprintsIndex,
  ...containersBlueprintIndex,
  ...effectsBlueprintsIndex,
  ...helmetsBlueprintsIndex,
  ...swordBlueprintIndex,
  ...daggersBlueprintsIndex,
  ...armorsBlueprintsIndex,
  ...axeBlueprintIndex,
  ...bootsBlueprintIndex,
  ...foodsBlueprintIndex,
};
