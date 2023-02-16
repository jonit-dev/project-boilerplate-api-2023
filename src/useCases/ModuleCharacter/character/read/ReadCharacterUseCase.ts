import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { provide } from "inversify-binding-decorators";
@provide(ReadCharacterUseCase)
export class ReadCharacterUseCase {
  constructor(private characterRepository: CharacterRepository, private characterInventory: CharacterInventory) {}

  public async read(id: string): Promise<ICharacter> {
    const character = await this.characterRepository.readOne(
      Character,
      {
        _id: id,
      },
      ["owner", "skills"]
    );

    // convert character to object to we can pass the inventory to it (otherwise it will output a {})
    //! TODO: Temporary ugly hack until we figure out a better way to do this
    const charObject = character.toObject();

    const inventory = await this.characterInventory.getInventory(character);
    // @ts-ignore
    delete charObject.inventory;
    // @ts-ignore
    charObject.inventory = inventory;
    // @ts-ignore
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
      const inventory = await this.characterInventory.getInventory(char);

      // @ts-ignore
      char.inventory = inventory;
    }

    return characters;
  }
}
