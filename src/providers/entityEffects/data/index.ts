import { entityEffectPoison } from "./blueprints/entityEffectPoison";
import { EntityEffectBlueprint } from "./types/entityEffectBlueprintTypes";

export const entityEffectsBlueprintsIndex = {
  [EntityEffectBlueprint.Poison]: entityEffectPoison,
};
