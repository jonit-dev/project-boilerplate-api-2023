import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";

import { provide } from "inversify-binding-decorators";

@provide(SocketConnection)
export class SocketConnection {
  constructor(private characterRepository: CharacterRepository) {}

  public async getConnectedCharacters(): Promise<ICharacter[]> {
    return await this.characterRepository.find(
      {
        isOnline: true,
      },
      {
        leanType: "lean",
      }
    );
  }
}
