import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import {
  AccessoriesBlueprint,
  ArmorsBlueprint,
  BootsBlueprint,
  ContainersBlueprint,
  CraftingResourcesBlueprint,
  DaggersBlueprint,
  FoodsBlueprint,
  HelmetsBlueprint,
  ToolsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { CRUD } from "@providers/mongoDB/MongoCRUDGeneric";
import { SpellLearn } from "@providers/spells/SpellLearn";
import { CreateCharacterDTO } from "@useCases/ModuleCharacter/character/create/CreateCharacterDTO";
import { UpdateCharacterDTO } from "@useCases/ModuleCharacter/character/update/UpdateCharacterDTO";
import { provide } from "inversify-binding-decorators";

@provide(CharacterRepository)
export class CharacterRepository extends CRUD {
  constructor(
    private analyticsHelper: AnalyticsHelper,
    private characterWeight: CharacterWeight,
    private spellLearn: SpellLearn,
    private characterInventory: CharacterInventory,
    private characterItemInventory: CharacterItemInventory
  ) {
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

    const { inventory, armor, leftHand, head, boot, neck } = await this.generateInitialItems(createdCharacter);

    let equipment = new Equipment();
    equipment.inventory = inventory;
    equipment.leftHand = leftHand;
    equipment.armor = armor;
    equipment.head = head;
    equipment.boot = boot;
    equipment.neck = neck;
    equipment = await equipment.save();

    createdCharacter.equipment = equipment._id;

    skills.owner = createdCharacter._id;
    await skills.save();

    equipment.owner = createdCharacter._id;
    await equipment.save();

    await this.generateInventoryItems(createdCharacter); // items to be added on character's bag!

    const weight = await this.characterWeight.getWeight(createdCharacter);
    const maxWeight = await this.characterWeight.getMaxWeight(createdCharacter);
    createdCharacter.weight = weight;
    createdCharacter.maxWeight = maxWeight;

    await createdCharacter.save();

    await this.spellLearn.learnLatestSkillLevelSpells(createdCharacter._id, false);

    const charObject = createdCharacter.toObject();
    const characterInventory = await this.characterInventory.getInventory(createdCharacter);
    // @ts-ignore
    charObject.inventory = characterInventory;

    // @ts-ignore
    return charObject;
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
      isEquipped: true,
    });
    await item.save();
    return item;
  }

  private async generateInitialItems(character: ICharacter): Promise<Partial<IEquipment>> {
    const ownerId = character._id;

    const bag = await this.generateInitialItem(ContainersBlueprint.Bag, ownerId);
    const dagger = await this.generateInitialItem(DaggersBlueprint.Dagger, ownerId);
    const jacket = await this.generateInitialItem(ArmorsBlueprint.Jacket, ownerId);
    const cap = await this.generateInitialItem(HelmetsBlueprint.Cap, ownerId);
    const boot = await this.generateInitialItem(BootsBlueprint.Boots, ownerId);
    const bandana = await this.generateInitialItem(AccessoriesBlueprint.Bandana, ownerId);

    return {
      inventory: bag._id,
      leftHand: dagger._id,
      armor: jacket._id,
      head: cap._id,
      boot: boot._id,
      neck: bandana._id,
    };
  }

  private async generateInventoryItems(character: ICharacter): Promise<void> {
    await this.characterItemInventory.addItemToInventory(ToolsBlueprint.FishingRod, character);
    await this.characterItemInventory.addItemToInventory(CraftingResourcesBlueprint.Worm, character, {
      stackQty: 10,
    });
    await this.characterItemInventory.addItemToInventory(ToolsBlueprint.CarpentersAxe, character);
    await this.characterItemInventory.addItemToInventory(ToolsBlueprint.Pickaxe, character);
    await this.characterItemInventory.addItemToInventory(FoodsBlueprint.Apple, character, {
      stackQty: 20,
    });
  }
}
