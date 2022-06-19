import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { BattleEventType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

type BattleParticipant = ICharacter | INPC;

@provide(BattleEvent)
export class BattleEvent {
  public async calculateEvent(attacker: BattleParticipant, target: BattleParticipant): Promise<BattleEventType> {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const defenderSkills = target.skills as unknown as ISkill;

    const defenderModifiers = (await defenderSkills.defense) + defenderSkills.dexterity.level;
    const attackerModifiers = (await attackerSkills.attack) + attackerSkills.dexterity.level;

    const hitChance = 21 - ((defenderModifiers - attackerModifiers) / 20) * 100;

    const n = _.random(0, 100);

    if (n <= hitChance) {
      return BattleEventType.Hit;
    } else {
      return BattleEventType.Miss;
    }
  }

  public async calculateHitDamage(attacker: BattleParticipant, target: BattleParticipant): Promise<number> {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const defenderSkills = target.skills as unknown as ISkill;

    const totalPotentialAttackerDamage = (await attackerSkills.attack) * (100 / 100 + (await defenderSkills.defense));

    return Math.round(_.random(0, totalPotentialAttackerDamage));
  }
}
