import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { provide } from "inversify-binding-decorators";
@provide(ReadCharacterUseCase)
export class ReadCharacterUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  public async read(id: string): Promise<ICharacter> {
    const character = await this.characterRepository.readOne(
      Character,
      {
        _id: id,
      },
      ["owner", "skills"]
    );

    // convert character to object to we can pass the inventory to it (otherwise it will output a {})
    const charObject = character.toObject();

    const inventory = await character.inventory;
    delete charObject.inventory;
    charObject.inventory = inventory;

    return charObject;
  }

  public async readAll(ownerId: string): Promise<ICharacter[]> {
    const characters = await this.characterRepository.readAll(
      Character,
      {
        owner: ownerId,
      },
      false,
      null,
      true
    );

    for (const char of characters) {
      const inventory = await char.inventory;
      char.inventory = inventory;
    }

    return characters;
  }
}
