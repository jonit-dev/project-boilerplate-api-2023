import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { container } from "@providers/inversify/container";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { spellsBlueprints } from "./data/blueprints/index";
import { ISpell } from "@providers/spells/data/types/SpellsBlueprintTypes";
@provide(SpellCast)
export class SpellCast {
  private skillIncrease: SkillIncrease;

  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private animationEffect: AnimationEffect
  ) {}

  private getSkillIncreaseInstance(): SkillIncrease {
    // Circular Injection
    if (!this.skillIncrease) {
      this.skillIncrease = container.get<SkillIncrease>(SkillIncrease);
    }
    return this.skillIncrease;
  }

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

    await this.getSkillIncreaseInstance().increaseMagicSP(character, spell);

    return true;
  }

  public async learnLatestSkillLevelSpells(characterId: string, notifyUser: boolean): Promise<void> {
    const character = (await Character.findOne({ _id: characterId }).populate("skills")) as unknown as ICharacter;
    const skills = character.skills as unknown as ISkill;

    const spells = this.getSkillLevelSpells(skills.level);
    await this.addToCharacterLearnedSpells(character, spells);

    notifyUser && this.sendLearnedSpellNotification(character, spells);
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

    if (!skills) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you can not cast this spell without any skills."
      );
      return false;
    }

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
    for (const key in spellsBlueprints) {
      const spell = spellsBlueprints[key];
      if (spell.magicWords === magicWords) {
        return spell;
      }
    }
    return null;
  }

  private getSkillLevelSpells(level): ISpell[] {
    const spells: ISpell[] = [];
    for (const key in spellsBlueprints) {
      const spell = spellsBlueprints[key];
      if (spell.magicWords && level === spell.minLevelRequired) {
        spells.push(spell as unknown as ISpell);
      }
    }
    return spells;
  }

  private async addToCharacterLearnedSpells(character: ICharacter, spells: ISpell[]): Promise<void> {
    const learned = character.learnedSpells ?? [];
    spells.forEach((spell) => {
      if (!learned.includes(spell.key)) {
        learned.push(spell.key);
      }
    });

    character.learnedSpells = learned;
    await character.save();
  }

  private async sendPostSpellCastEvents(character: ICharacter, spell: ISpell): Promise<void> {
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

    await this.animationEffect.sendAnimationEventToCharacter(character, spell.animationKey);
  }

  private sendLearnedSpellNotification(character: ICharacter, spells: ISpell[]): void {
    if (!spells || spells.length < 1) {
      return;
    }
    const learned: string[] = [];
    spells.forEach((spell) => {
      learned.push(spell.name + " (" + spell.magicWords + ")");
    });

    this.socketMessaging.sendErrorMessageToCharacter(
      character,
      "You have learned new spell(s): " + learned.join(", "),
      "info"
    );
  }
}
