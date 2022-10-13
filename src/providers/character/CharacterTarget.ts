import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { BattleCycle } from "@providers/battle/BattleCycle";
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
}
