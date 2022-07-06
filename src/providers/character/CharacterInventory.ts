import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ContainersBlueprint } from "@providers/item/data/types/blueprintTypes";
import { provide } from "inversify-binding-decorators";

@provide(CharacterInventory)
export class CharacterInventory {
  public async addEquipmentToCharacter(character: ICharacter): Promise<void> {
    const equipment = await this.createEquipmentWithInventory();

    character.equipment = equipment._id;
    await character.save();
  }

  public async createEquipmentWithInventory(): Promise<IEquipment> {
    const equipment = new Equipment();

    const blueprintData = itemsBlueprintIndex[ContainersBlueprint.Backpack];

    const backpack = new Item({
      ...blueprintData,
    });
    await backpack.save();

    equipment.inventory = backpack._id;
    await equipment.save();

    return equipment;
  }
}
