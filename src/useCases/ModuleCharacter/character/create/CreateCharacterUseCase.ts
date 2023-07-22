import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { User } from "@entities/ModuleSystem/UserModel";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { FactionRepository } from "@repositories/ModuleCharacter/FactionRepository";
import { provide } from "inversify-binding-decorators";
import { CreateCharacterDTO } from "./CreateCharacterDTO";

@provide(CreateCharacterUseCase)
export class CreateCharacterUseCase {
  constructor(private characterRepository: CharacterRepository, private factionRepository: FactionRepository) {}

  public async create(newCharacter: CreateCharacterDTO, ownerId: string): Promise<ICharacter> {
    newCharacter.name = newCharacter.name.trim();

    // assign character to user
    const user = await User.findOne({ _id: ownerId });
    if (!user) {
      throw new BadRequestError("Character creation error: User not found!");
    }

    const isValidTextureKey = await this.factionRepository.exists(newCharacter.race, newCharacter.textureKey);
    if (!isValidTextureKey) {
      throw new BadRequestError(
        TS.translate("validation", "requiredResourceCreate", {
          field: "textureKey",
        })
      );
    }

    const createdCharacter = await this.characterRepository.createCharacter(newCharacter, ownerId);

    user.characters?.push(createdCharacter._id);
    await user.save();

    return createdCharacter;
  }
}
