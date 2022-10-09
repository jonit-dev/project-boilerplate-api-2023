import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { IUseWithItem, IUseWithTile } from "@rpg-engine/shared";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { provide } from "inversify-binding-decorators";
import { IUseWithTileEffect } from "../blueprints/UseWithTileBlueprints";
import { IUseWithItemEffect } from "../blueprints/UseWithItemBlueprints";

export interface IValidUseWithResponse {
  originItem: IItem;
  targetItem?: IItem;
  useWithEffect: IUseWithTileEffect | IUseWithItemEffect;
}

@provide(UseWithHelper)
export class UseWithHelper {
  constructor(private characterValidation: CharacterValidation, private characterItems: CharacterItems) {}

  public basicValidations(character: ICharacter, data: IUseWithItem | IUseWithTile): void {
    const isValid = this.characterValidation.hasBasicValidation(character);
    if (!isValid) {
      throw new Error(`UseWith > Character does not fulfill basic validations! Character id: ${character.id}`);
    }

    if (!data.originItemId) {
      throw new Error(`UseWith > Field 'originItemId' is missing! data: ${JSON.stringify(data)}`);
    }
  }

  public async getItem(character: ICharacter, itemId: string): Promise<IItem> {
    const hasItem = await this.characterItems.hasItem(itemId, character, "both");
    if (!hasItem) {
      throw new Error("UseWith > Character does not own the item that wants to use");
    }

    // Check if the item corresponds to the useWithKey
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error(`UseWith > Item with id ${itemId} does not exist!`);
    }
    return item;
  }
}
