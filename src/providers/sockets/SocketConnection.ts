import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { ICharacter } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(SocketConnection)
export class SocketConnection {
  public async getConnectedCharacters(): Promise<ICharacter[]> {
    return await Character.find({
      isOnline: true,
    }).lean();
  }
}
