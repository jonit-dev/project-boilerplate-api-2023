import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data";
import { ICharacterItemBuff, IEquippableItemBlueprint } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBuffActivator } from "./CharacterBuffActivator";
import { CharacterBuffTracker } from "./CharacterBuffTracker";

@provide(CharacterItemBuff)
export class CharacterItemBuff {
  constructor(private characterBuff: CharacterBuffActivator, private characterBuffTracker: CharacterBuffTracker) {}

  public async enableItemBuff(character: ICharacter, item: IItem): Promise<void> {
    const itemBlueprint = itemsBlueprintIndex[item.baseKey] as IEquippableItemBlueprint;

    if (!itemBlueprint?.equippedBuff) {
      return;
    }

    const equippedBuffs = Array.isArray(itemBlueprint.equippedBuff)
      ? itemBlueprint.equippedBuff
      : [itemBlueprint.equippedBuff];

    for (const buff of equippedBuffs) {
      const buffData = {
        ...buff,
        itemId: item._id,
        itemKey: item.baseKey,
      } as ICharacterItemBuff;

      await this.characterBuff.enablePermanentBuff(character, buffData);
    }
  }

  public async disableItemBuff(character: ICharacter, itemId: string): Promise<void> {
    const itemBuff = await this.characterBuffTracker.getBuffByItemId(character, itemId);

    if (!itemBuff) {
      return;
    }

    await this.characterBuff.disableBuff(character, itemBuff._id!, itemBuff.type);
  }
}
