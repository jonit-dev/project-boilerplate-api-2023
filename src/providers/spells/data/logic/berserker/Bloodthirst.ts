import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BasicAttribute, CharacterClass, SpellsBlueprint } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NamespaceRedisControl } from "../../types/SpellsBlueprintTypes";

@provide(Bloodthirst)
export class Bloodthirst {
  constructor(
    private socketMessaging: SocketMessaging,
    private inMemoryHashTable: InMemoryHashTable,
    private traitGetter: TraitGetter
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
      const berserkerMultiplier = 0.5;

      const skills = (await Skill.findById(character.skills)
        .lean()
        .cacheQuery({
          cacheKey: `${character?._id}-skills`,
        })) as ISkill;

      const magicLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, BasicAttribute.Magic);
      const characterLevel = skills?.level;
      const strengthLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, BasicAttribute.Strength);

      const healingFactor = (magicLevel + characterLevel + strengthLevel) / 6;
      const calculatedHealing = Math.round(damage * berserkerMultiplier * healingFactor);

      const cappedHealing = Math.min(character.health + calculatedHealing, character.maxHealth);

      await Character.findByIdAndUpdate(character._id, { health: cappedHealing }).lean();

      await this.socketMessaging.sendEventAttributeChange(character._id);
    } catch (error) {
      console.error(`Failed to apply berserker bloodthirst: ${error} - ${character._id}`);
    }
  }
}
