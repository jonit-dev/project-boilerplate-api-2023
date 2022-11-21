import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { EntryEffectBlueprint } from "../types/entryEffectBlueprintTypes";
import { IEntityEffect } from "./entityEffect";

export const entityEffectPoison: Partial<IEntityEffect> = {
  key: EntryEffectBlueprint.Poison,
  totalDurationMs: 5000 * 60, // how long should it last?
  intervalMs: 2000, // interval between each effect triggering
  effect: (target: ICharacter | INPC) => {
    target.health = -10;
  }, // effect logic here... decrease target HP},
  probability: 20, // 20% chance of triggering it for the NPC that attacks a target
  targetAnimationKey: "poison",
  type: EntityAttackType.Melee,
};
