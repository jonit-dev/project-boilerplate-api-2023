import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { BattleEventType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

type BattleParticipant = ICharacter | INPC;

@provide(BattleEvent)
export class BattleEvent {
  public calculateEvent(attacker: BattleParticipant, target: BattleParticipant): BattleEventType {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const defenderSkills = target.skills as unknown as ISkill;

    const attackersCalculatedDexterity = attackerSkills.dexterity + _.random(0, 100);
    const defendersCalculatedDexterity = defenderSkills.dexterity + _.random(0, 100);

    if (attackersCalculatedDexterity > defendersCalculatedDexterity) {
      return BattleEventType.Hit;
    } else {
      return BattleEventType.Miss;
    }
  }

  public calculateHitDamage(attacker: BattleParticipant, target: BattleParticipant): number {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const defenderSkills = target.skills as unknown as ISkill;

    const totalPotentialAttackerDamage = attackerSkills.attack * (100 / 100 + defenderSkills.defense);

    return _.random(0, totalPotentialAttackerDamage);
  }
}
