import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { provide } from "inversify-binding-decorators";
import { UpdateCharacterDTO } from "./UpdateCharacterDTO";

@provide(UpdateCharacterUseCase)
export class UpdateCharacterUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  public async updateCharacter(id: string, updateCharacter: UpdateCharacterDTO, ownerId: string): Promise<ICharacter> {
    const characterToUpdate = (await this.characterRepository.readOne(Character, {
      _id: id,
    })) as ICharacter;

    if (!characterToUpdate.owner.equals(ownerId)) {
      throw new BadRequestError("You cannot update a character which is not yours!");
    }

    return await this.characterRepository.updateCharacter(id, updateCharacter, ownerId);
  }
}
