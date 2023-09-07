import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { LinearInterpolation } from "@providers/math/LinearInterpolation";
import { SkillsAvailable } from "@providers/skill/SkillTypes";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BasicAttribute, EntityType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { IRequiredOptions, SpellCalculator } from "../../abstractions/SpellCalculator";

@provide(ManaDrain)
export class ManaDrain {
  constructor(
    private socketMessaging: SocketMessaging,
    private spellCalculator: SpellCalculator,
    private linearInterpolation: LinearInterpolation,
    private traitGetter: TraitGetter
  ) {}

  public async handleManaDrain(attacker: ICharacter, target: ICharacter): Promise<boolean> {
    try {
      if (attacker._id.toString() === target._id.toString()) {
        return false;
      }

      if (target.mana === 0) {
        this.socketMessaging.sendErrorMessageToCharacter(attacker, "This character has no mana to drain");

        return false;
      }

      if (target.type !== EntityType.Character) {
        this.socketMessaging.sendErrorMessageToCharacter(attacker, "You can only drain mana from Characters");
        return false;
      }

      const manaDrainPercent =
        (await this.calculateManaDrained(attacker, BasicAttribute.Magic, {
          min: 5,
          max: 50,
        })) / 100;

      const attackerManaAmountDrained = Math.floor(attacker.maxMana * manaDrainPercent);
      const initialTargetMana = target.mana;

      if (attackerManaAmountDrained > initialTargetMana) {
        attacker.mana += initialTargetMana;
        target.mana = 0;
      } else {
        attacker.mana += attackerManaAmountDrained;
        target.mana -= attackerManaAmountDrained;
      }

      attacker.mana = Math.min(attacker.mana, attacker.maxMana);
      target.mana = Math.max(target.mana, 0);

      const actualManaDrained = initialTargetMana - target.mana;

      (await Character.updateOne({ _id: attacker._id }, { mana: attacker.mana }).lean()) as ICharacter;

      (await Character.updateOne({ _id: target._id }, { mana: target.mana }).lean()) as ICharacter;

      await this.socketMessaging.sendEventAttributeChange(attacker._id);
      await this.socketMessaging.sendEventAttributeChange(target._id);

      this.socketMessaging.sendMessageToCharacter(
        attacker,
        `You drained ${actualManaDrained} mana from ${target.name}`
      );

      this.socketMessaging.sendMessageToCharacter(target, `You lost ${actualManaDrained} mana to ${attacker.name}`);

      return true;
    } catch (error) {
      console.error(`Failed to handle sorcerer mana drain: ${error}`);
      return false;
    }
  }

  private async calculateManaDrained(
    character: ICharacter,
    skillName: SkillsAvailable,
    options: IRequiredOptions
  ): Promise<number> {
    const skills = await this.spellCalculator.getCharacterSkill(character);

    const skillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, skillName);

    return this.linearInterpolation.calculateLinearInterpolation(
      skillLevel,
      options.min,
      options.max,
      options.skillAssociation
    );
  }
}
