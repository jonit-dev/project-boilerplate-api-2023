import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterBonusPenalties } from "@providers/character/characterBonusPenalties/CharacterBonusPenalties";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { InMemoryHashTable, NamespaceRedisControl } from "@providers/database/InMemoryHashTable";
import { EntityUtil } from "@providers/entityEffects/EntityUtil";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ISpell } from "@providers/spells/data/types/SpellsBlueprintTypes";
import {
  BasicAttribute,
  CharacterSocketEvents,
  EntityType,
  ICharacterAttributeChanged,
  ISpellCast,
  NPCAlignment,
  SpellCastingType,
  SpellSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SpellValidation } from "./SpellValidation";
import { spellsBlueprints } from "./data/blueprints/index";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";

@provide(SpellCast)
export class SpellCast {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private animationEffect: AnimationEffect,
    private characterItems: CharacterItems,
    private skillIncrease: SkillIncrease,
    private characterBonusPenalties: CharacterBonusPenalties,
    private itemUsableEffect: ItemUsableEffect,
    private spellValidation: SpellValidation,
    private inMemoryHashTable: InMemoryHashTable,
    private movementHelper: MovementHelper,
    private specialEffect: SpecialEffect
  ) {}

  public isSpellCasting(msg: string): boolean {
    return !!this.getSpell(msg);
  }

  public async castSpell(data: ISpellCast, character: ICharacter): Promise<boolean> {
    if (!this.characterValidation.hasBasicValidation(character)) {
      return false;
    }

    const spell = this.getSpell(data.magicWords);
    if (spell?.castingType === SpellCastingType.RangedCasting && (!data.targetType || !data.targetId)) {
      this.sendIdentifyTargetEvent(character, data);
      return false;
    }

    if (!(await this.isSpellCastingValid(spell, character))) {
      return false;
    }

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    let key = spell.attribute;
    key || (key = spell.key);

    if (key) {
      const buffActivated = await this.inMemoryHashTable.has(namespace, key);

      if (buffActivated) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `Sorry, ${spell.name} is already activated or in cooldown.`
        );
        return false;
      }
    }

    let target;
    if (spell.castingType === SpellCastingType.RangedCasting) {
      target = await EntityUtil.getEntity(data.targetId!, data.targetType!);
      if (!(await this.isRangedCastingValid(character, target, spell))) {
        return false;
      }
    }

    const hasCastSucceeded = await spell.usableEffect(character, target);

    // if it fails, it will return explicitly false above. We prevent moving forward, so mana is not spent unnecessarily
    if (hasCastSucceeded === false) {
      return false;
    }

    this.itemUsableEffect.apply(character, EffectableAttribute.Mana, -1 * spell.manaCost);
    await character.save();

    await this.sendPostSpellCastEvents(character, spell, target);

    await this.skillIncrease.increaseMagicSP(character, spell.manaCost);
    if (target?.type === EntityType.Character) {
      await this.skillIncrease.increaseMagicResistanceSP(target, spell.manaCost);
    }

    await this.characterBonusPenalties.applyRaceBonusPenalties(character, BasicAttribute.Magic);

    return true;
  }

  private async isRangedCastingValid(caster: ICharacter, target: ICharacter | INPC, spell: ISpell): Promise<boolean> {
    if (!target) {
      this.socketMessaging.sendErrorMessageToCharacter(
        caster,
        "Sorry, you need to select a valid target to cast this spell."
      );
      return false;
    }

    if (target.type === EntityType.NPC && (target as INPC).alignment === NPCAlignment.Friendly) {
      return false;
    }

    if (await this.specialEffect.isInvisible(target)) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, your target is invisible.");
      return false;
    }

    const isUnderRange = this.movementHelper.isUnderRange(
      caster.x,
      caster.y,
      target.x!,
      target.y!,
      spell.maxDistanceGrid || 1
    );
    if (!isUnderRange) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, your target is out of reach.");
      return false;
    }

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

    const cannotCastMsg = "Sorry, you can not cast this spell.";
    if (!this.spellValidation.isAvailableForCharacterClass(spell, character)) {
      this.socketMessaging.sendErrorMessageToCharacter(character, cannotCastMsg);
      return false;
    }

    if (character.mana < spell.manaCost) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you do not have mana to cast this spell.");
      return false;
    }

    if (spell.requiredItem) {
      const required = itemsBlueprintIndex[spell.requiredItem];
      if (!required) {
        this.socketMessaging.sendErrorMessageToCharacter(character, cannotCastMsg);

        console.log(`❌ SpellCast: Missing item blueprint for key ${spell.requiredItem}`);
        return false;
      }

      const hasItem = await this.characterItems.hasItemByKey(required.key, character, "inventory");
      if (!hasItem) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `Sorry, you must have a ${required.name} in inventory to cast this spell.`
        );
        return false;
      }
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
      if (spell.magicWords === magicWords.toLocaleLowerCase()) {
        return spell;
      }
    }
    return null;
  }

  private async sendPostSpellCastEvents(
    character: ICharacter,
    spell: ISpell,
    target?: ICharacter | INPC
  ): Promise<void> {
    const updatedCharacter = (await Character.findById(character._id).lean({ virtuals: true })) as ICharacter;

    const payload: ICharacterAttributeChanged = {
      targetId: updatedCharacter._id,
      health: updatedCharacter.health,
      mana: updatedCharacter.mana,
      speed: updatedCharacter.speed,
    };

    this.socketMessaging.sendEventToUser(updatedCharacter.channelId!, CharacterSocketEvents.AttributeChanged, payload);
    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      updatedCharacter,
      CharacterSocketEvents.AttributeChanged,
      payload
    );

    if (target) {
      await this.animationEffect.sendProjectileAnimationEventToCharacter(
        updatedCharacter,
        updatedCharacter._id,
        target._id,
        spell.projectileAnimationKey,
        spell.animationKey
      );
    } else {
      await this.animationEffect.sendAnimationEventToCharacter(updatedCharacter, spell.animationKey);
    }
  }

  private sendIdentifyTargetEvent(character: ICharacter, data: ISpellCast): void {
    this.socketMessaging.sendEventToUser(character.channelId!, SpellSocketEvents.IdentifyTarget, data);
  }
}
