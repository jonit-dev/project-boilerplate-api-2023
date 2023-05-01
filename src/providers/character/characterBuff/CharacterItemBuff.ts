import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data";
import { ICharacterItemBuff, IEquippableItemBlueprint } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBuff } from "./CharacterBuff";
import { CharacterBuffTracker } from "./CharacterBuffTracker";

@provide(CharacterItemBuff)
export class CharacterItemBuff {
  constructor(private characterBuff: CharacterBuff, private characterBuffTracker: CharacterBuffTracker) {}

  public async enableItemBuff(character: ICharacter, item: IItem): Promise<void> {
    const itemBlueprint = itemsBlueprintIndex[item.key] as IEquippableItemBlueprint;

    if (!itemBlueprint?.equippedBuff) {
      return;
    }

    // return if there's an ongoing buff to the same item

    const hasOngoingBuff = await this.characterBuffTracker.getBuffByItemKey(character, item.key);

    if (hasOngoingBuff) {
      return;
    }

    const buff = {
      ...itemBlueprint.equippedBuff,
      itemId: item._id,
      itemKey: item.key,
    } as ICharacterItemBuff;

    await this.characterBuff.enablePermanentBuff(character, buff);
  }

  public async disableItemBuff(character: ICharacter, itemId: string): Promise<void> {
    const itemBuff = await this.characterBuffTracker.getBuffByItemId(character, itemId);

    if (!itemBuff) {
      return;
    }

    await this.characterBuff.disableBuff(character, itemBuff._id!, itemBuff.type);
  }
}
