import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ItemSubType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterDeath)
export class CharacterDeath {
  public async generateCharacterBody(character: ICharacter): Promise<void> {
    const blueprintData = itemsBlueprintIndex["character-body"];

    const charBody = new Item({
      ...blueprintData,
      owner: character.id,
      name: `${character.name}'s body`,
      scene: character.scene,
      x: character.x,
      y: character.y,
      subType: ItemSubType.Body,
    });

    await charBody.save();
  }

  public async respawnCharacter(character: ICharacter): Promise<void> {
    character.health = character.maxHealth;
    character.x = character.initialX;
    character.y = character.initialY;
    await character.save();
  }
}
