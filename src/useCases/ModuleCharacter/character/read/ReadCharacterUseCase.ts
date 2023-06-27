import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { EntityPositionDocMiddleware } from "@providers/entity/EntityPositionDocMiddleware";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { CharacterRESTRepository } from "@repositories/ModuleCharacter/CharacterRESTRepository";
import { provide } from "inversify-binding-decorators";

@provide(ReadCharacterUseCase)
export class ReadCharacterUseCase {
  constructor(
    private characterRESTRepository: CharacterRESTRepository,
    private characterInventory: CharacterInventory,
    private specialEffect: SpecialEffect,
    private entityPositionDocMiddleware: EntityPositionDocMiddleware
  ) {}

  public async read(id: string): Promise<ICharacter> {
    const character = await this.characterRESTRepository.readOne(
      Character,
      {
        _id: id,
      },
      ["owner", "skills"]
    );

    // convert character to object to we can pass the inventory to it (otherwise it will output a {})
    //! TODO: Temporary ugly hack until we figure out a better way to do this
    let charObject = character.toObject() as ICharacter;

    charObject = await this.entityPositionDocMiddleware.applyCharacterMiddleware(charObject);

    charObject.alpha = await this.specialEffect.getOpacity(character);

    const inventory = await this.characterInventory.getInventory(character);
    // @ts-ignore
    delete charObject.inventory;
    // @ts-ignore
    charObject.inventory = inventory;
    // @ts-ignore
    return charObject;
  }

  public async readAll(ownerId: string): Promise<ICharacter[]> {
    const characters = await this.characterRESTRepository.readAll(
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
