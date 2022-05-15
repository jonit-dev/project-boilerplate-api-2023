import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { provide } from "inversify-binding-decorators";

@provide(CharacterConnection)
export class CharacterConnection {
  public async resetCharacterAttributes(): Promise<void> {
    await Character.updateMany(
      {},
      {
        $set: {
          isOnline: false,
          target: null,
        },
      }
    );
  }
}
