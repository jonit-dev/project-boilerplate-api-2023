import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { bodiesBlueprintsIndex } from "./blueprints/bodies/index";
import { containersBlueprintIndex } from "./blueprints/containers/index";
import { effectsBlueprintsIndex } from "./blueprints/effects/index";
import { swordBlueprintIndex } from "./blueprints/swords/index";

export const itemsBlueprintIndex: IBlueprint = {
  ...swordBlueprintIndex,
  ...bodiesBlueprintsIndex,
  ...effectsBlueprintsIndex,
  ...containersBlueprintIndex,
};
