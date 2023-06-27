import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EntityPositionDocMiddleware } from "@providers/entity/EntityPositionDocMiddleware";
import { ILeanCRUDOptions, LeanCRUD, defaultLeanCRUDOptions } from "@providers/mongoDB/LeanCRUD";
import { provide } from "inversify-binding-decorators";
import { FilterQuery } from "mongoose";

interface ICharacterQuery extends ICharacter {
  _id: string;
  id: string;
}

@provide(CharacterRepository)
export class CharacterRepository {
  constructor(private entityPositionDocMiddleware: EntityPositionDocMiddleware, private leanCRUD: LeanCRUD) {}

  public async findOne(
    filter: FilterQuery<ICharacterQuery>,
    options: ILeanCRUDOptions = defaultLeanCRUDOptions
  ): Promise<ICharacter | undefined> {
    return await this.leanCRUD.findOne<ICharacter>(Character, filter, options, (doc: ICharacter) =>
      this.entityPositionDocMiddleware.applyCharacterMiddleware(doc)
    );
  }

  public async findById(
    characterId: string,
    options: ILeanCRUDOptions = defaultLeanCRUDOptions
  ): Promise<ICharacter | undefined> {
    try {
      const result = await this.findOne({ _id: characterId }, options);

      return result;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  }

  public async findByIdAndUpdate(
    characterId: string,
    update: Partial<ICharacterQuery>,
    options: ILeanCRUDOptions = defaultLeanCRUDOptions
  ): Promise<ICharacter> {
    try {
      const result = await this.leanCRUD.findByIdAndUpdate<ICharacter>(
        Character,
        characterId,
        update,
        defaultLeanCRUDOptions,
        (doc: ICharacter) => this.entityPositionDocMiddleware.applyCharacterMiddleware(doc)
      );

      if (!result) throw new Error("Character not found");

      return result;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  }

  public async find(
    filter: FilterQuery<ICharacterQuery>,
    options: ILeanCRUDOptions = defaultLeanCRUDOptions
  ): Promise<ICharacter[]> {
    return await this.leanCRUD.find<ICharacter>(Character, filter, options, (doc: ICharacter) =>
      this.entityPositionDocMiddleware.applyCharacterMiddleware(doc)
    );
  }
}
