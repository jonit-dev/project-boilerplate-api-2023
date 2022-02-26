import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { provide } from "inversify-binding-decorators";

@provide(ReadCharacterUseCase)
export class ReadCharacterUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  public async read(id: string): Promise<ICharacter> {
    return await this.characterRepository.readOne(
      Character,
      {
        _id: id,
      },
      ["owner"]
    );
  }

  public async readAll(ownerId: string): Promise<ICharacter[]> {
    return await this.characterRepository.readAll(
      Character,
      {
        owner: ownerId,
      },
      ["owner"]
    );
  }
}
