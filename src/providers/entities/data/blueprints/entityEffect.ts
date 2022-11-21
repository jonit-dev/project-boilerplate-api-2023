import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";

export interface IEntityEffect {
  key: string;
  totalDurationMs?: number;
  intervalMs: number;
  effect: (target: ICharacter | INPC) => void | Promise<void>;
  probability: number;
  targetAnimationKey: string;
  type: EntityAttackType.Melee | EntityAttackType.Ranged;
}
