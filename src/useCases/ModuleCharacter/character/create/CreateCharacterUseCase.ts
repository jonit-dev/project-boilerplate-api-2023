import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { User } from "@entities/ModuleSystem/UserModel";
import { isAlphanumeric } from "@providers/constants/AlphanumericConstants";
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
    // assign character to user
    const user = await User.findOne({ _id: ownerId });
    if (!user) {
      throw new BadRequestError("Character creation error: User not found!");
    }

    if (user.characters && user.characters.length >= 7) {
      throw new BadRequestError("Maximum character limit reached");
    }

    const isValidTextureKey = await this.factionRepository.exists(newCharacter.race, newCharacter.textureKey);
    if (!isValidTextureKey) {
      throw new BadRequestError(
        TS.translate("validation", "requiredResourceCreate", {
          field: "textureKey",
        })
      );
    }

    if (!isAlphanumeric(newCharacter.name)) {
      throw new BadRequestError("Sorry, your character name must use only letters or numbers (alphanumeric)!");
    }

    const createdCharacter = await this.characterRepository.createCharacter(newCharacter, ownerId);

    user.characters?.push(createdCharacter._id);
    await user.save();

    return createdCharacter;
  }
}
