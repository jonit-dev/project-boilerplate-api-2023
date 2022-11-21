import { entityEffectPoison } from "./blueprints/entityEffectPoison";
import { EntryEffectBlueprint } from "./types/entryEffectBlueprintTypes";

export const entitiesBlueprintsIndex = {
  [EntryEffectBlueprint.Poison]: entityEffectPoison,
};
