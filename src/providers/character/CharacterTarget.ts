import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { BattleCycle } from "@providers/battle/BattleCycle";
import { appEnv } from "@providers/config/env";
import { NPCMovementType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterTarget)
export class CharacterTarget {
  public async clearTarget(character: ICharacter): Promise<void> {
    if (!character.target) {
      return;
    }

    // clear character target on the database

    await Character.updateOne({ _id: character._id }, { $unset: { target: 1 } });

    // and on battle cycle
    const battleCycle = BattleCycle.battleCycles.get(character.id);
    if (battleCycle) {
      await battleCycle.clear();
    }
  }

  public async setFocusOnCharacter(npc: INPC, character: ICharacter): Promise<void> {
    await NPC.updateOne(
      {
        _id: npc._id,
      },
      {
        $set: {
          currentMovementType: NPCMovementType.Stopped,
          targetCharacter: character._id,
        },
      }
    );

    // auto clear after 1 minute

    if (!appEnv.general.IS_UNIT_TEST) {
      setTimeout(async () => {
        await NPC.updateOne(
          {
            _id: npc._id,
          },
          {
            $set: {
              currentMovementType: npc.originalMovementType,
              targetCharacter: undefined,
            },
          }
        );
      }, 60 * 1000);
    }
  }
}
