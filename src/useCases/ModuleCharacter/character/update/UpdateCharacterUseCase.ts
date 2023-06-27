import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { CharacterRESTRepository } from "@repositories/ModuleCharacter/CharacterRESTRepository";
import { provide } from "inversify-binding-decorators";
import { UpdateCharacterDTO } from "./UpdateCharacterDTO";

@provide(UpdateCharacterUseCase)
export class UpdateCharacterUseCase {
  constructor(private characterRESTRepository: CharacterRESTRepository) {}

  public async updateCharacter(id: string, updateCharacter: UpdateCharacterDTO, ownerId: string): Promise<ICharacter> {
    const characterToUpdate = (await this.characterRESTRepository.readOne(Character, {
      _id: id,
    })) as ICharacter;

    // @ts-ignore
    if (!characterToUpdate.owner.equals(ownerId)) {
      throw new BadRequestError("You cannot update a character which is not yours!");
    }

    return await this.characterRESTRepository.updateCharacter(id, updateCharacter, ownerId);
  }
}
