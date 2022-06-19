import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { User } from "@entities/ModuleSystem/UserModel";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { provide } from "inversify-binding-decorators";
import { CreateCharacterDTO } from "./CreateCharacterDTO";

@provide(CreateCharacterUseCase)
export class CreateCharacterUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  public async create(newCharacter: CreateCharacterDTO, ownerId: string): Promise<ICharacter> {
    // assign character to user
    const user = await User.findOne({ _id: ownerId });
    if (!user) {
      throw new BadRequestError("Character creation error: User not found!");
    }

    const createdCharacter = await this.characterRepository.createCharacter(newCharacter, ownerId);

    user.characters?.push(createdCharacter._id);
    await user.save();

    return createdCharacter;
  }
}
