import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { CRUD } from "@providers/mongoDB/MongoCRUDGeneric";
import { CreateCharacterDTO } from "@useCases/ModuleCharacter/character/create/CreateCharacterDTO";
import { provide } from "inversify-binding-decorators";

@provide(CharacterRepository)
export class CharacterRepository extends CRUD {
  constructor(private analyticsHelper: AnalyticsHelper) {
    super(analyticsHelper);
  }

  public async createCharacter(newCharacter: CreateCharacterDTO, ownerId: string): Promise<ICharacter> {
    const createdCharacter = await this.create(
      Character,
      {
        ...newCharacter,
        owner: ownerId,
      },
      null,
      ["name"]
    );

    return createdCharacter;
  }
}
