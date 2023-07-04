import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { provide } from "inversify-binding-decorators";

@provide(CharacterConnection)
export class CharacterConnection {
  @TrackNewRelicTransaction()
  public async resetCharacterAttributes(): Promise<void> {
    await Character.updateMany(
      {},
      {
        $set: {
          isOnline: false,
        },
        $unset: {
          target: 1,
        },
      }
    );
  }
}
