import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SwordBlueprint } from "@providers/item/data/types/blueprintTypes";
import { provide } from "inversify-binding-decorators";

@provide(CharacterInventory)
export class CharacterInventory {
  public async addEquipmentCharacter(character: ICharacter): Promise<void> {
    const equipment = await this.generateEquipment();

    character.equipment = equipment._id;
    await character.save();
  }

  public async generateEquipment(): Promise<IEquipment> {
    const equipment = new Equipment();

    const blueprintData = itemsBlueprintIndex[SwordBlueprint.ShortSword];

    const shortSword = new Item({
      ...blueprintData,
      x: 10,
      y: 20,
      scene: "Ilya",
    });
    await shortSword.save();

    const inventory = shortSword;

    equipment.inventory = inventory._id;
    await equipment.save();

    return equipment;
  }
}
