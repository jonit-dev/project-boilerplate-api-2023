import { Character } from "@entities/ModuleSystem/CharacterModel";
import { ICharacter } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(GeckosConnection)
export class GeckosConnection {
  public async getConnectedCharacters(): Promise<ICharacter[]> {
    return await Character.find({
      isOnline: true,
    }).lean();
  }
}
