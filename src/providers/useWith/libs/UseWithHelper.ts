import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { ITEM_USE_WITH_BASE_EFFECT, ITEM_USE_WITH_BASE_SCALING_FACTOR } from "@providers/constants/ItemConstants";
import { blueprintManager } from "@providers/inversify/container";
import { AvailableBlueprints } from "@providers/item/data/types/itemsBlueprintTypes";
import { IMagicItemUseWithEntity } from "@providers/useWith/useWithTypes";
import { ISkill, IUseWithItem, IUseWithTile } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";

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

export async function calculateItemUseEffectPoints(itemKey: string, caster: ICharacter): Promise<number> {
  const updatedCharacter = (await Character.findOne({ _id: caster._id }).lean({
    virtuals: true,
    defaults: true,
  })) as unknown as ICharacter;

  const skills = (await Skill.findById(updatedCharacter.skills)
    .lean({
      virtuals: true,
      defaults: true,
    })
    .cacheQuery({
      cacheKey: `${updatedCharacter._id}-skills`,
    })) as unknown as ISkill;

  updatedCharacter.skills = skills;

  const magicLevel = (updatedCharacter.skills as unknown as ISkill)?.magic?.level ?? 0;

  const itemData = await blueprintManager.getBlueprint<IMagicItemUseWithEntity>(
    "items",
    itemKey as AvailableBlueprints
  );

  if (!itemData.power) {
    throw new Error(`Item ${itemKey} does not have a power property`);
  }

  const minPoints = itemData.power ?? 1;
  const scalingFactor = ITEM_USE_WITH_BASE_EFFECT + magicLevel * ITEM_USE_WITH_BASE_SCALING_FACTOR;
  const maxPoints = Math.round(minPoints + magicLevel * scalingFactor);

  // Adjust the minPoints and maxPoints to reduce the range
  const adjustedMinPoints = minPoints + (maxPoints - minPoints) * 0.75; // Start from the 75% of the range
  const adjustedMaxPoints = minPoints + (maxPoints - minPoints) * 1; // End at the 100% of the range

  return random(adjustedMinPoints, adjustedMaxPoints);
}
