import { entityEffectBleeding } from "./blueprints/entityEffectBleeding";
import { entityEffectPoison } from "./blueprints/entityEffectPoison";
import { EntityEffectBlueprint } from "./types/entityEffectBlueprintTypes";

export const entityEffectsBlueprintsIndex = {
  [EntityEffectBlueprint.Poison]: entityEffectPoison,
  [EntityEffectBlueprint.Bleeding]: entityEffectBleeding,
};
