import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, INPCAttributeChanged, NPCSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(NPCSpellLifeSteal)
export class NPCSpellLifeSteal {
  constructor(private socketMessaging: SocketMessaging) {}

  public async performLifeSteal(caster: INPC, target: ICharacter): Promise<void> {
    // make sure we have an updated caster to avoid maxHealth overflow!
    caster = (await NPC.findById(caster._id).lean()) as INPC;

    const potentialLifeSteal = this.calculatePotentialLifeSteal(target);

    await this.performCasterLifeSteal(caster, target, potentialLifeSteal);

    await this.performTargetLifeSteal(target, potentialLifeSteal);
  }

  private async performCasterLifeSteal(caster: INPC, target: ICharacter, potentialLifeSteal: number): Promise<void> {
    const updatedCasterHealth = await this.updateCasterHealth(caster, potentialLifeSteal);
    await this.sendCasterLifeStealEvents(caster, target, updatedCasterHealth);
  }

  private async performTargetLifeSteal(target: ICharacter, potentialLifeSteal: number): Promise<void> {
    const updatedTargetHealth = await this.updateTargetHealth(target, potentialLifeSteal);
    await this.sendTargetLifeStealEvents(target, updatedTargetHealth);
  }

  private calculatePotentialLifeSteal(target: ICharacter): number {
    const result = _.random(1, target.maxHealth * 0.1);

    return result;
  }

  private async updateTargetHealth(target: ICharacter, lifeSteal: number): Promise<number> {
    let newHealth = target.health - lifeSteal;

    if (newHealth < 0) {
      newHealth = 1;
    }

    const updatedCharacter = (await Character.findOneAndUpdate(
      { _id: target._id },
      { health: newHealth },
      { new: true, returnOriginal: false }
    )) as ICharacter;

    return updatedCharacter.health;
  }

  private async updateCasterHealth(caster: INPC, lifeSteal: number): Promise<number> {
    let newHealth = caster.health + lifeSteal;

    if (newHealth > caster.maxHealth) {
      newHealth = caster.maxHealth;
    }

    if (newHealth < 0) {
      newHealth = 1;
    }

    const updatedNPC = (await NPC.findOneAndUpdate(
      { _id: caster._id },
      { health: newHealth },
      { new: true, returnOriginal: false }
    )) as INPC;

    return updatedNPC.health;
  }

  private async sendCasterLifeStealEvents(caster: INPC, target: ICharacter, updatedHealth: number): Promise<void> {
    const payload: INPCAttributeChanged = {
      targetId: caster._id,
      health: updatedHealth,
    };

    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      target,
      NPCSocketEvents.NPCAttributeChanged,
      payload,
      true
    );
  }

  private async sendTargetLifeStealEvents(target: ICharacter, updatedHealth: number): Promise<void> {
    const payload: INPCAttributeChanged = {
      targetId: target._id,
      health: updatedHealth,
    };

    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      target,
      CharacterSocketEvents.AttributeChanged,
      payload,
      true
    );
  }
}
