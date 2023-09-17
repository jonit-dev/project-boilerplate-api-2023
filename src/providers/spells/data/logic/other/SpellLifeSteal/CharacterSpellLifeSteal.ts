import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { BasicAttribute, CharacterSocketEvents, EntityType, INPCAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterSpellLifeSteal)
export class CharacterSpellLifeSteal {
  constructor(private socketMessaging: SocketMessaging, private spellCalculator: SpellCalculator) {}

  public async performLifeSteal(caster: ICharacter, target: ICharacter | INPC): Promise<void> {
    // make sure we have an updated caster to avoid maxHealth overflow!
    caster = (await Character.findById(caster._id).lean()) as ICharacter;

    const potentialLifeSteal = await this.calculatePotentialLifeSteal(caster, target);

    await this.performCasterLifeSteal(caster, potentialLifeSteal);

    await this.performTargetLifeSteal(caster, target, potentialLifeSteal);
  }

  private async performCasterLifeSteal(caster: ICharacter, potentialLifeSteal: number): Promise<void> {
    const updatedCasterHealth = await this.updateCasterHealth(caster, potentialLifeSteal);
    await this.sendCasterLifeStealEvents(caster, updatedCasterHealth);
  }

  private async performTargetLifeSteal(
    caster: ICharacter,
    target: ICharacter | INPC,
    potentialLifeSteal: number
  ): Promise<void> {
    const updatedTargetHealth = await this.updateTargetHealth(target, potentialLifeSteal);

    if (!updatedTargetHealth) {
      return;
    }

    await this.sendTargetLifeStealEvents(caster, target, updatedTargetHealth);
  }

  private async calculatePotentialLifeSteal(caster: ICharacter, target: ICharacter | INPC): Promise<number> {
    const lifeSteal = await this.spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 1,
      max: target.maxHealth,
    });

    return lifeSteal;
  }

  private async updateTargetHealth(target: ICharacter | INPC, lifeSteal: number): Promise<number | undefined> {
    let newHealth = target.health - lifeSteal;

    if (newHealth < 0) {
      newHealth = 1;
    }

    switch (target.type) {
      case EntityType.Character:
        const updatedCharacter = (await Character.findOneAndUpdate(
          { _id: target._id },
          { health: newHealth },
          { new: true, returnOriginal: false }
        )) as ICharacter;

        return updatedCharacter.health;
      case EntityType.NPC:
        const updatedNPC = (await NPC.findOneAndUpdate(
          { _id: target._id },
          { health: newHealth },
          { new: true, returnOriginal: false }
        )) as INPC;

        return updatedNPC.health;
    }
  }

  private async updateCasterHealth(caster: ICharacter, lifeSteal: number): Promise<number> {
    let newHealth = caster.health + lifeSteal;

    if (newHealth > caster.maxHealth) {
      newHealth = caster.maxHealth;
    }

    if (newHealth < 0) {
      newHealth = 1;
    }

    const updatedCharacter = (await Character.findOneAndUpdate(
      { _id: caster._id },
      { health: newHealth },
      { new: true, returnOriginal: false }
    )) as ICharacter;

    return updatedCharacter.health;
  }

  private async sendCasterLifeStealEvents(caster: ICharacter, updatedHealth: number): Promise<void> {
    const payload: INPCAttributeChanged = {
      targetId: caster._id,
      health: updatedHealth,
    };

    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      caster,
      CharacterSocketEvents.AttributeChanged,
      payload,
      true
    );
  }

  private async sendTargetLifeStealEvents(
    caster: ICharacter,
    target: ICharacter | INPC,
    updatedHealth: number
  ): Promise<void> {
    const payload: INPCAttributeChanged = {
      targetId: target._id,
      health: updatedHealth,
    };

    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      caster,
      CharacterSocketEvents.AttributeChanged,
      payload,
      true
    );
  }
}
