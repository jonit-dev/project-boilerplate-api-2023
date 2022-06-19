import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EquipementSet } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { containersBlueprintIndex } from "@providers/item/data/blueprints/containers/index";
import { ContainersBlueprint } from "@providers/item/data/types/blueprintTypes";
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

    const bagItem = await createBagItem();
    const backPackItem = await createBackPackItem();

    let equipmentSet = new EquipementSet();
    equipmentSet.inventory = bagItem._id;
    equipmentSet = await equipmentSet.save();

    const createdCharacter = await this.create(
      Character,
      {
        ...newCharacter,
        owner: ownerId,
        skills: skills._id,
        equipmentSet: equipmentSet._id,
      },
      null,
      ["name"]
    );
    await createdCharacter.save();

    skills.owner = createdCharacter._id;
    await skills.save();

    equipmentSet.owner = createdCharacter._id;
    await equipmentSet.save();

    return createdCharacter;
  }

  public async updateCharacter(id: string, updateCharacter: UpdateCharacterDTO, ownerId: string): Promise<ICharacter> {
    //! check if owner is the owner of this resource!

    return await this.update(Character, id, updateCharacter, null);
  }
}

async function createBagItem(): Promise<IItem> {
  const blueprintData = containersBlueprintIndex[ContainersBlueprint.Bag];
  const bagItem = new Item({
    ...blueprintData,
  });
  return await bagItem.save();
}

async function createBackPackItem(): Promise<IItem> {
  const blueprintData = containersBlueprintIndex[ContainersBlueprint.Backpack];
  const backPackItem = new Item({
    ...blueprintData,
  });
  return await backPackItem.save();
}
