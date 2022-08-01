import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ArmorsBlueprint, ContainersBlueprint, DaggersBluePrint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CRUD } from "@providers/mongoDB/MongoCRUDGeneric";
import { CreateCharacterDTO } from "@useCases/ModuleCharacter/character/create/CreateCharacterDTO";
import { UpdateCharacterDTO } from "@useCases/ModuleCharacter/character/update/UpdateCharacterDTO";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

interface IInitialItems {
  inventory: Types.ObjectId;
  leftHand: Types.ObjectId;
  armor: Types.ObjectId;
}
@provide(CharacterRepository)
export class CharacterRepository extends CRUD {
  constructor(private analyticsHelper: AnalyticsHelper, private characterWeight: CharacterWeight) {
    super(analyticsHelper);
  }

  public async createCharacter(newCharacter: CreateCharacterDTO, ownerId: string): Promise<ICharacter> {
    const skills = new Skill({ ownerType: "Character" });
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

    const weight = await this.characterWeight.getWeight(createdCharacter);
    const maxWeight = await this.characterWeight.getMaxWeight(createdCharacter);

    createdCharacter.weight = weight;
    createdCharacter.maxWeight = maxWeight;

    await createdCharacter.save();

    const { inventory, armor, leftHand } = await this.generateInitialItems(createdCharacter._id);

    let equipment = new Equipment();
    equipment.inventory = inventory;
    equipment.leftHand = leftHand;
    equipment.armor = armor;
    equipment = await equipment.save();

    createdCharacter.equipment = equipment._id;

    await createdCharacter.save();

    skills.owner = createdCharacter._id;
    await skills.save();

    equipment.owner = createdCharacter._id;
    await equipment.save();

    return createdCharacter;
  }

  public async updateCharacter(id: string, updateCharacter: UpdateCharacterDTO, ownerId: string): Promise<ICharacter> {
    //! check if owner is the owner of this resource!

    return await this.update(Character, id, updateCharacter, null);
  }

  private async generateInitialItem(blueprintKey: string, ownerId: string): Promise<IItem> {
    const blueprintData = itemsBlueprintIndex[blueprintKey];
    const item = new Item({
      ...blueprintData,
      owner: ownerId,
    });
    await item.save();
    return item;
  }

  private async generateInitialItems(ownerId: string): Promise<IInitialItems> {
    const bag = await this.generateInitialItem(ContainersBlueprint.Bag, ownerId);
    const dagger = await this.generateInitialItem(DaggersBluePrint.Dagger, ownerId);
    const jacket = await this.generateInitialItem(ArmorsBlueprint.Jacket, ownerId);

    return {
      inventory: bag._id,
      leftHand: dagger._id,
      armor: jacket._id,
    };
  }
}
