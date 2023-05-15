import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationEffectKeys,
  CharacterClass,
  CharacterSocketEvents,
  ICharacterAttributeChanged,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { NamespaceRedisControl, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

@provide(Bloodthirst)
export class Bloodthirst {
  constructor(
    private socketMessaging: SocketMessaging,
    private inMemoryHashTable: InMemoryHashTable,
    private animationEffect: AnimationEffect
  ) {}

  public async handleBerserkerAttack(character: ICharacter, damage: number): Promise<void> {
    try {
      if (!character || character.class !== CharacterClass.Berserker || character.health === character.maxHealth) {
        return;
      }

      await this.applyBerserkerBloodthirst(character, damage);
    } catch (error) {
      console.error(`Failed to handle berserker attack: ${error}`);
    }
  }

  public async getBerserkerBloodthirstSpell(character: ICharacter): Promise<boolean> {
    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id.toString()}`;
    const key = SpellsBlueprint.BerserkerBloodthirst;
    const spell = await this.inMemoryHashTable.get(namespace, key);

    return !!spell;
  }

  private async applyBerserkerBloodthirst(character: ICharacter, damage: number): Promise<void> {
    try {
      const berserkerMultiplier = 0.1;

      const skills = await Skill.findById(character.skills).lean();

      const magicLevel = skills?.magic.level;
      const characterLevel = skills?.level;
      const strengthLevel = skills?.strength.level;

      const healingFactor = (magicLevel + characterLevel + strengthLevel) / 4;
      const calculatedHealing = Math.round(damage * berserkerMultiplier * healingFactor);

      const cappedHealing = Math.min(character.health + calculatedHealing, character.maxHealth);

      await Character.findByIdAndUpdate(character._id, { health: cappedHealing }).lean();

      await this.sendEventAttributeChange(character._id);
    } catch (error) {
      console.error(`Failed to apply berserker bloodthirst: ${error} - ${character._id}`);
    }
  }

  private async sendEventAttributeChange(characterId: Types.ObjectId): Promise<void> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;
    const payload: ICharacterAttributeChanged = {
      targetId: character._id,
      health: character.health,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);

    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      character,
      CharacterSocketEvents.AttributeChanged,
      payload
    );

    await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.Lifedrain);
  }
}