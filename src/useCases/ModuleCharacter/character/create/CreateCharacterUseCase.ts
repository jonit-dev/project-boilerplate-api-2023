import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { provide } from "inversify-binding-decorators";
import { CreateCharacterDTO } from "./CreateCharacterDTO";

@provide(CreateCharacterUseCase)
export class CreateCharacterUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  public async create(newCharacter: CreateCharacterDTO, ownerId: string): Promise<ICharacter> {
    return await this.characterRepository.createCharacter(newCharacter, ownerId);
  }
}
