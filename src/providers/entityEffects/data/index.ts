import { entityEffectBleeding } from "./blueprints/entityEffectBleeding";
import { entityEffectFreezing } from "./blueprints/entityEffectFreezing";
import { entityEffectPoison } from "./blueprints/entityEffectPoison";
import { EntityEffectBlueprint } from "./types/entityEffectBlueprintTypes";

export const entityEffectsBlueprintsIndex = {
  [EntityEffectBlueprint.Poison]: entityEffectPoison,
  [EntityEffectBlueprint.Bleeding]: entityEffectBleeding,
  [EntityEffectBlueprint.Freezing]: entityEffectFreezing,
};
