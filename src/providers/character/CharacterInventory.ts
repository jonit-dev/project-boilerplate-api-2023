import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { provide } from "inversify-binding-decorators";

@provide(CharacterInventory)
export class CharacterInventory {
  public async generateNewInventory(
    character: ICharacter,
    inventoryType: ContainersBlueprint,
    useExistingEquipment: boolean = false
  ): Promise<IEquipment> {
    let equipment;

    if (!useExistingEquipment) {
      equipment = new Equipment();
      equipment.save();
    } else {
      equipment = await Equipment.findById(character.equipment);

      if (!equipment) {
        throw new Error("Equipment not found");
      }
    }

    equipment.owner = character._id;

    const containerBlueprint = itemsBlueprintIndex[inventoryType];

    const bag = new Item({
      ...containerBlueprint,
      owner: equipment.owner,
    });
    await bag.save();

    equipment.inventory = bag._id;
    await equipment.save();

    return equipment;
  }
}
