import { ICharacter, Character } from "@entities/ModuleCharacter/CharacterModel";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { IItemSpell } from "./data/blueprints/spells/index";

@provide(ItemSpellCast)
export class ItemSpellCast {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private animationEffect: AnimationEffect
  ) {}

  public isSpellCasting(msg: string): boolean {
    return !!this.getSpell(msg);
  }

  public async castSpell(magicWords: string, character: ICharacter): Promise<boolean> {
    if (!this.characterValidation.hasBasicValidation(character)) {
      return false;
    }

    const spell = this.getSpell(magicWords);
    if (!(await this.isSpellCastingValid(spell, character))) {
      return false;
    }

    spell.usableEffect(character);
    await character.save();

    await this.sendPostSpellCastEvents(character, spell);

    return true;
  }

  private async isSpellCastingValid(spell, character: ICharacter): Promise<boolean> {
    if (!spell) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, spell not found.");
      return false;
    }

    if (!character.learnedSpells || character.learnedSpells.indexOf(spell.key) < 0) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you have not learned this spell.");
      return false;
    }

    if (character.mana < spell.manaCost) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you do not have mana to cast this spell.");
      return false;
    }

    const updatedCharacter = (await Character.findOne({ _id: character._id }).populate(
      "skills"
    )) as unknown as ICharacter;
    const skills = updatedCharacter.skills as unknown as ISkill;

    if (skills.level < spell.minLevelRequired) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you can not cast this spell at this character level."
      );
      return false;
    }

    if (skills.magic.level < spell.minMagicLevelRequired) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you can not cast this spell at this character magic level."
      );
      return false;
    }

    return true;
  }

  private getSpell(magicWords: string): any {
    for (const key in itemsBlueprintIndex) {
      const item = itemsBlueprintIndex[key];
      if (item.magicWords === magicWords) {
        return item;
      }
    }
    return null;
  }

  private async sendPostSpellCastEvents(character: ICharacter, spell: IItemSpell): Promise<void> {
    const payload: ICharacterAttributeChanged = {
      targetId: character._id,
      health: character.health,
      mana: character.mana,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      character,
      CharacterSocketEvents.AttributeChanged,
      payload
    );

    await this.animationEffect.sendAnimationEvent(character, spell.animationKey);
  }
}
