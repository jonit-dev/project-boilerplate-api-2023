import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BasicAttribute, CharacterClass, CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";

import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { provide } from "inversify-binding-decorators";
import { CharacterWeightCalculator } from "./CharacterWeightCalculator";

@provide(CharacterWeight)
export class CharacterWeight {
  constructor(
    private socketMessaging: SocketMessaging,
    private traitGetter: TraitGetter,
    private inMemoryHashTable: InMemoryHashTable,
    private characterWeightCalculator: CharacterWeightCalculator
  ) {}

  @TrackNewRelicTransaction()
  public async updateCharacterWeight(character: ICharacter): Promise<void> {
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
    const result = await this.characterWeightCalculator.getTotalCharacterCalculatedWeight(character);

    return result;
  }

  public async getWeightRatio(character: ICharacter, item: IItem): Promise<number> {
    const weight = await this.getWeight(character);
    const maxWeight = await this.getMaxWeight(character);

    return (weight + item.weight) / maxWeight;
  }
}
