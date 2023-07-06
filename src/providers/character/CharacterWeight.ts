import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  BasicAttribute,
  CharacterClass,
  CharacterSocketEvents,
  ICharacterAttributeChanged,
  ItemType,
} from "@rpg-engine/shared";

import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";

@provide(CharacterWeight)
export class CharacterWeight {
  constructor(
    private characterInventory: CharacterInventory,
    private socketMessaging: SocketMessaging,
    private characterItemInventory: CharacterItemInventory,
    private traitGetter: TraitGetter,
    private inMemoryHashTable: InMemoryHashTable,
    private equipmentSlots: EquipmentSlots
  ) {}

  @TrackNewRelicTransaction()
  public async updateCharacterWeight(character: ICharacter): Promise<void> {
    await this.inMemoryHashTable.delete("character-weights", character._id);
    await this.inMemoryHashTable.delete("character-max-weights", character._id);

    const weight = await this.getWeight(character);
    const maxWeight = await this.getMaxWeight(character);

    await Character.updateOne(
      {
        _id: character._id,
      },
      {
        $set: {
          weight,
          maxWeight,
        },
      }
    );

    //! Requires virtuals
    character = (await Character.findById(character._id).lean({ virtuals: true, defaults: true })) || character;

    this.socketMessaging.sendEventToUser<ICharacterAttributeChanged>(
      character.channelId!,
      CharacterSocketEvents.AttributeChanged,
      {
        speed: character.speed,
        weight,
        maxWeight,
        targetId: character._id,
      }
    );
  }

  @TrackNewRelicTransaction()
  public async getMaxWeight(character: ICharacter): Promise<number> {
    const maxWeight = (await this.inMemoryHashTable.get("character-max-weights", character._id)) as unknown as number;

    if (maxWeight) {
      return maxWeight;
    }

    const calculatedMaxWeight = await this.calculateMaxWeight(character);

    await this.inMemoryHashTable.set("character-max-weights", character._id, calculatedMaxWeight);

    return calculatedMaxWeight;
  }

  private async calculateMaxWeight(character: ICharacter): Promise<number> {
    const skills = (await Skill.findById(character.skills)
      .lean()
      .cacheQuery({
        cacheKey: `${character?._id}-skills`,
      })) as unknown as ISkill;

    if (skills) {
      if (character.class === CharacterClass.Sorcerer || character.class === CharacterClass.Druid) {
        const magicLvl = await this.traitGetter.getSkillLevelWithBuffs(skills as ISkill, BasicAttribute.Magic);

        return magicLvl * 15;
      }

      const strengthLvl = await this.traitGetter.getSkillLevelWithBuffs(skills as ISkill, BasicAttribute.Strength);

      return strengthLvl * 15;
    } else {
      return 15;
    }
  }

  @TrackNewRelicTransaction()
  public async getWeight(character: ICharacter): Promise<number> {
    const weightCache = (await this.inMemoryHashTable.get("character-weights", character._id)) as unknown as number;

    if (weightCache) {
      return weightCache;
    }

    const inventory = await this.characterInventory.getInventory(character);
    const inventoryContainer = (await ItemContainer.findById(inventory?.itemContainer).lean()) as IItemContainer;

    let totalWeight = 0;

    const { head, neck, leftHand, rightHand, ring, legs, boot, accessory, armor } =
      await this.equipmentSlots.getEquipmentSlots(character.equipment?.toString()!);
    const slots: Types.ObjectId[] = [
      head!,
      neck!,
      leftHand!,
      rightHand!,
      ring!,
      legs!,
      boot!,
      accessory!,
      armor!,
      inventory!,
    ];
    const nestedBags = await this.characterItemInventory.getAllItemsFromInventoryNested(character);

    if (nestedBags.length > 0) {
      for (const item of nestedBags) {
        // check if nestedBag is actually on the inventory top level

        const isInInventory = await this.characterItemInventory.checkItemInInventory(item._id, character);

        if (!isInInventory) continue;

        if (item.type === ItemType.Container) {
          const inventoryContainer = (await ItemContainer.findById(item?.itemContainer).lean()) as IItemContainer;

          const itemIds = this.getAllItemContainerIds(inventoryContainer);

          for (const bagItem of itemIds) {
            totalWeight += await this.getWeightFromItemContainer(bagItem);
          }
        }
      }
    }

    for (const slot of slots) {
      if (!slot) continue;

      const item = await Item.findById(slot).lean().select("weight stackQty");
      if (item) {
        if (item.stackQty && item.stackQty > 1) {
          // -1 because the count is include the weight of the container item.
          // 100 arrows x 0.1 = 10 weight, but the result will be 10.1 without the -1.
          totalWeight += item.weight * (item.stackQty - 1);
        }
        totalWeight += item.weight;
      }
    }

    if (inventoryContainer) {
      const itemIds = this.getAllItemContainerIds(inventoryContainer);

      for (const bagItem of itemIds) {
        totalWeight += await this.getWeightFromItemContainer(bagItem);
      }
    }

    await this.inMemoryHashTable.set("character-weights", character._id, totalWeight);

    return totalWeight;
  }

  public async getWeightRatio(character: ICharacter, item: IItem): Promise<number> {
    const weight = await this.getWeight(character);
    const maxWeight = await this.getMaxWeight(character);

    return (weight + item.weight) / maxWeight;
  }

  private getAllItemContainerIds(itemContainer: IItemContainer): string[] {
    const slots: { [key: string]: IItem } = itemContainer.slots;

    const ids = Object.values(slots)
      .filter((slot) => slot !== null)
      .map((item: IItem) => item._id.toString());
    return ids;
  }

  private async getWeightFromItemContainer(bagItem: string): Promise<number> {
    let totalWeight = 0;
    try {
      // @ts-ignore
      const item = await Item.findById(bagItem).lean().select("weight stackQty");
      if (item) {
        if (item.stackQty && item.stackQty > 1) {
          totalWeight += item.weight * (item.stackQty - 1);
        }
        totalWeight += item.weight;
      }
    } catch (error) {
      console.error(error);
    }

    return totalWeight;
  }
}
