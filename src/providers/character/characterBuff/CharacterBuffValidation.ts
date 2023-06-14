import { ICharacterBuff, ICharacterItemBuff } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBuffAttribute } from "./CharacterBuffAttribute";
import { CharacterBuffTracker } from "./CharacterBuffTracker";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";

interface IBuff extends ICharacterBuff {
  itemKey?: string;
  itemId?: string;
}

@provide(CharacterBuffValidation)
export class CharacterBuffValidation {
  constructor(
    private characterBuffAttribute: CharacterBuffAttribute,
    private characterBuffTracker: CharacterBuffTracker
  ) {}

  public async removeDuplicatedBuffsForSameItem(character: ICharacter): Promise<void> {
    const allCharacterBuffs = (await this.characterBuffTracker.getAllCharacterBuffs(character._id)) as IBuff[];

    const itemBuffs = allCharacterBuffs.filter((buff) => !!buff.itemId) as ICharacterItemBuff[];

    const duplicatedBuffsToRemove = this.getDuplicatedItemBuffsToDelete(this.groupItemBuffsByItemId(itemBuffs));

    for (const buff of duplicatedBuffsToRemove) {
      if (buff._id) await this.characterBuffAttribute.disableBuff(character, buff._id, true);
    }
  }

  private groupItemBuffsByItemId(itemBuffs: ICharacterItemBuff[]): { [key: string]: ICharacterItemBuff[] } {
    const itemBuffsGrouped = itemBuffs.reduce((acc, buff) => {
      if (!acc[buff.itemId + buff.trait]) {
        acc[buff.itemId + buff.trait] = [];
      }

      acc[buff.itemId + buff.trait].push(buff);

      return acc;
    }, {} as { [key: string]: ICharacterItemBuff[] });

    return itemBuffsGrouped;
  }

  private getDuplicatedItemBuffsToDelete(itemBuffsGrouped: {
    [key: string]: ICharacterItemBuff[];
  }): ICharacterItemBuff[] {
    const itemBuffsGroupedWithDuplicates: { [key: string]: ICharacterItemBuff[] } = {};

    Object.keys(itemBuffsGrouped).forEach((itemId) => {
      const buffs = itemBuffsGrouped[itemId];

      if (buffs.length > 1) {
        const sortedBuffs = buffs.sort((a, b) => {
          const aAbsoluteChange = a.absoluteChange ?? 0;
          const bAbsoluteChange = b.absoluteChange ?? 0;

          if (aAbsoluteChange > bAbsoluteChange) {
            return 1;
          }

          if (aAbsoluteChange < bAbsoluteChange) {
            return -1;
          }

          return 0;
        });

        itemBuffsGroupedWithDuplicates[itemId] = sortedBuffs;
      }
    });

    const duplicatedBuffsToRemove = Object.values(itemBuffsGroupedWithDuplicates).reduce((acc, buffs) => {
      const [buffToKeep, ...buffsToRemove] = buffs;

      acc.push(...buffsToRemove);

      return acc;
    }, [] as ICharacterItemBuff[]);

    return duplicatedBuffsToRemove;
  }
}
