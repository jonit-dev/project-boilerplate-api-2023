import { entityEffectBleeding } from "./blueprints/entityEffectBleeding";
import { entityEffectBurning } from "./blueprints/entityEffectBurning";
import { entityEffectCorruption } from "./blueprints/entityEffectCorruption";
import { entityEffectFreezing } from "./blueprints/entityEffectFreezing";
import { entityEffectPoison } from "./blueprints/entityEffectPoison";
import { entityEffectVineGrasp } from "./blueprints/entityEffectVineGrasp";
import { EntityEffectBlueprint } from "./types/entityEffectBlueprintTypes";

export const entityEffectsBlueprintsIndex = {
  [EntityEffectBlueprint.Poison]: entityEffectPoison,
  [EntityEffectBlueprint.Bleeding]: entityEffectBleeding,
  [EntityEffectBlueprint.Freezing]: entityEffectFreezing,
  [EntityEffectBlueprint.Burning]: entityEffectBurning,
  [EntityEffectBlueprint.Corruption]: entityEffectCorruption,
  [EntityEffectBlueprint.VineGrasp]: entityEffectVineGrasp,
};
