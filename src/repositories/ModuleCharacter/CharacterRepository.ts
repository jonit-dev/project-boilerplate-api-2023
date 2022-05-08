import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleSkills/SkillsModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { CRUD } from "@providers/mongoDB/MongoCRUDGeneric";
import { CreateCharacterDTO } from "@useCases/ModuleCharacter/character/create/CreateCharacterDTO";
import { UpdateCharacterDTO } from "@useCases/ModuleCharacter/character/update/UpdateCharacterDTO";
import { provide } from "inversify-binding-decorators";

@provide(CharacterRepository)
export class CharacterRepository extends CRUD {
  constructor(private analyticsHelper: AnalyticsHelper) {
    super(analyticsHelper);
  }

  public async createCharacter(newCharacter: CreateCharacterDTO, ownerId: string): Promise<ICharacter> {
    const skills = new Skill();
    await skills.save();

    const createdCharacter = await this.create(
      Character,
      {
        ...newCharacter,
        owner: ownerId,
        skills: skills._id,
      },
      null,
      ["name"]
    );
    await createdCharacter.save();

    skills.owner = createdCharacter._id;
    await skills.save();

    return createdCharacter;
  }

  public async updateCharacter(id: string, updateCharacter: UpdateCharacterDTO, ownerId: string): Promise<ICharacter> {
    //! check if owner is the owner of this resource!

    return await this.update(Character, id, updateCharacter, null);
  }
}
