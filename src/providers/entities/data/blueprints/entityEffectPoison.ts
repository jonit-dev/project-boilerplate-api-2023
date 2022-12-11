import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { EntryEffectBlueprint } from "../types/entryEffectBlueprintTypes";
import { IEntityEffect } from "./entityEffect";

export const entityEffectPoison: Partial<IEntityEffect> = {
  key: EntryEffectBlueprint.Poison,
  totalDurationMs: 5000 * 60, // how long should it last?
  intervalMs: 2000, // interval between each effect triggering
  value: 10,
  probability: 20, // 20% chance of triggering it for the NPC that attacks a target
  targetAnimationKey: "poison",
  type: EntityAttackType.Melee,
};
