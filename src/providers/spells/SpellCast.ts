import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { BattleCharacterAttackValidation } from "@providers/battle/BattleCharacterAttack/BattleCharacterAttackValidation";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterBonusPenalties } from "@providers/character/characterBonusPenalties/CharacterBonusPenalties";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { EntityUtil } from "@providers/entityEffects/EntityUtil";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { blueprintManager } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NamespaceRedisControl } from "@providers/spells/data/types/SpellsBlueprintTypes";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterSocketEvents,
  EntityType,
  ICharacterAttributeChanged,
  ISpell,
  ISpellCast,
  NPCAlignment,
  SpellCastingType,
  SpellSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import SpellCoolDown from "./SpellCooldown";
import { SpellValidation } from "./SpellValidation";
import { spellsBlueprints } from "./data/blueprints/index";
import SpellSilence from "./data/logic/mage/druid/SpellSilence";

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
    private specialEffect: SpecialEffect,
    private spellCoolDown: SpellCoolDown,
    private spellSilencer: SpellSilence,
    private mapNonPVPZone: MapNonPVPZone,

    private battleCharacterAttackValidation: BattleCharacterAttackValidation
  ) {}

  public isSpellCasting(msg: string): boolean {
    return !!this.getSpell(msg);
  }

  @TrackNewRelicTransaction()
  public async castSpell(data: ISpellCast, character: ICharacter): Promise<boolean> {
    if (!this.characterValidation.hasBasicValidation(character)) {
      return false;
    }

    const spell = this.getSpell(data.magicWords) as ISpell;

    if (!(await this.isSpellCastingValid(spell, character))) {
      return false;
    }

    if (spell.castingType === SpellCastingType.RangedCasting && (!data.targetType || !data.targetId)) {
      await this.sendPreSpellCastEvents(spell, character);
      this.sendIdentifyTargetEvent(character, data);
      return false;
    }

    if (spell.castingType === SpellCastingType.SelfCasting) {
      await this.sendPreSpellCastEvents(spell, character);
    }

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    let key = spell.attribute;
    // @ts-ignore
    key || (key = spell.key);

    if (key) {
      const buffActivated = await this.inMemoryHashTable.has(namespace, key);

      if (buffActivated) {
        this.socketMessaging.sendErrorMessageToCharacter(character, `Sorry, ${spell.name} is already activated.`);
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

    const hasSpellCooldown = await this.spellCoolDown.haveSpellCooldown(character._id, spell.magicWords);

    if (!hasSpellCooldown) {
      await this.spellCoolDown.setSpellCooldown(character._id, spell.magicWords, spell.cooldown);
    }
    await this.spellCoolDown.getAllSpellCooldowns(character);

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

    if (!spell.canSelfTarget) {
      if (caster._id.toString() === target._id?.toString()) {
        return false;
      }
    }

    const isTargetAtPZ = this.mapNonPVPZone.isNonPVPZoneAtXY(target.scene, target.x, target.y);

    if (isTargetAtPZ) {
      this.socketMessaging.sendErrorMessageToCharacter(caster, "Sorry, your target is at a protected zone.");

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

    const canAttack = await this.battleCharacterAttackValidation.canAttack(caster, target);
    if (!canAttack) {
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

    if (await this.spellSilencer.isSilent(character)) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you are silent. You cannot cast any spell.");
      return false;
    }

    const hasSpellCooldown = await this.spellCoolDown.haveSpellCooldown(character._id, spell.magicWords);
    if (hasSpellCooldown) {
      await this.spellCoolDown.getAllSpellCooldowns(character);
      const timeLeft = await this.spellCoolDown.getTimeLeft(character._id, spell.magicWords);
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        `Sorry, this spell is in cooldown. ${timeLeft} secs left`
      );

      return false;
    }

    if (!this.spellValidation.isAvailableForCharacterClass(spell, character)) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this spell is not available to your class.");
      return false;
    }

    if (character.mana < spell.manaCost) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you do not have mana to cast this spell.");
      return false;
    }

    if (spell.requiredItem) {
      const required = await blueprintManager.getBlueprint<IItem>("items", spell.requiredItem);

      if (!required) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          `Sorry, the item required to cast this spell is not available: ${spell.requiredItem}`
        );

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

  private async sendPreSpellCastEvents(spell: ISpell, character: ICharacter): Promise<void> {
    if (spell.castingAnimationKey) {
      await this.animationEffect.sendAnimationEventToCharacter(
        character,
        spell.castingAnimationKey as AnimationEffectKeys
      );
    }
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
      if (spell.projectileAnimationKey) {
        await this.animationEffect.sendProjectileAnimationEventToCharacter(
          updatedCharacter,
          updatedCharacter._id,
          target._id,
          spell.projectileAnimationKey
        );
      }

      if (spell.targetHitAnimationKey) {
        await this.animationEffect.sendAnimationEventToCharacter(
          target as ICharacter,
          spell.targetHitAnimationKey as AnimationEffectKeys
        );
      }
    }
  }

  private sendIdentifyTargetEvent(character: ICharacter, data: ISpellCast): void {
    this.socketMessaging.sendEventToUser(character.channelId!, SpellSocketEvents.IdentifyTarget, data);
  }
}
