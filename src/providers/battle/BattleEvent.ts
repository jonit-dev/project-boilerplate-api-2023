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

    const defenderDefense = await defenderSkills.defense;
    const attackerAttack = await attackerSkills.attack;

    const defenderModifiers = defenderDefense + defenderSkills.dexterity.level;
    const attackerModifiers = attackerAttack + attackerSkills.dexterity.level;

    const hitChance = 21 - ((defenderModifiers - attackerModifiers) / 20) * 100;

    const n = _.random(0, 100);

    if (n <= hitChance) {
      return BattleEventType.Hit;
    } else {
      // calculate miss or block chance

      const blockChance = 21 + ((defenderModifiers - attackerModifiers) / 20) * 100;
      const b = _.random(0, 100);

      if (b <= blockChance) {
        return BattleEventType.Block;
      }

      return BattleEventType.Miss;
    }
  }

  public async calculateHitDamage(attacker: BattleParticipant, target: BattleParticipant): Promise<number> {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const defenderSkills = target.skills as unknown as ISkill;

    const totalPotentialAttackerDamage = (await attackerSkills.attack) * (100 / 100 + (await defenderSkills.defense));

    const damage = Math.round(_.random(0, totalPotentialAttackerDamage));

    return damage;
  }
}
