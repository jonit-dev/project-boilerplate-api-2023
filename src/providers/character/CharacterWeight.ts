import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BasicAttribute, CharacterClass, CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";

import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { provide } from "inversify-binding-decorators";

@provide(CharacterWeight)
export class CharacterWeight {
  constructor(
    private socketMessaging: SocketMessaging,
    private traitGetter: TraitGetter,
    private inMemoryHashTable: InMemoryHashTable
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
    character =
      ((await Character.findById(character._id).lean({ virtuals: true, defaults: true })) as ICharacter) || character;

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

    const carriedItems = (await Item.find({
      owner: character._id,
      carrier: character._id,
    })
      .lean()
      .select("weight stackQty key")) as unknown as IItem[];

    if (!carriedItems) {
      return 0;
    }

    let totalWeight = 0;

    for (const item of carriedItems) {
      if (item.stackQty && item.stackQty > 1) {
        totalWeight += item.weight * item.stackQty;
      } else {
        totalWeight += item.weight;
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
}
