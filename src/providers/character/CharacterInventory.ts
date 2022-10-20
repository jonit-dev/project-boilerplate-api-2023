import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { provide } from "inversify-binding-decorators";

@provide(CharacterInventory)
export class CharacterInventory {
  public async addEquipmentToCharacter(character: ICharacter): Promise<void> {
    const equipment = await this.createEquipmentWithInventory(character, ContainersBlueprint.Backpack);

    character.equipment = equipment._id;
    await character.save();
  }

  public async createEquipmentWithInventory(
    character: ICharacter,
    inventoryType: ContainersBlueprint
  ): Promise<IEquipment> {
    const equipment = new Equipment();
    equipment.owner = character._id;

    const blueprintData = itemsBlueprintIndex[inventoryType];

    const backpack = new Item({
      ...blueprintData,
      owner: equipment.owner,
    });
    await backpack.save();

    equipment.inventory = backpack._id;
    await equipment.save();

    return equipment;
  }
}
