import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BasicAttribute, CharacterSocketEvents, EntityType, NPCSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { random } from "lodash";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

const MAX_LIFE_STEAL_PERCENTAGE = 0.25;

interface ILifeStealable {
  calculateLifeSteal(): number | Promise<number>;
  updateHealth(lifeStealAmount: number): Promise<void>;
  getEvent(): CharacterSocketEvents | NPCSocketEvents;
  sendLifeStealAmountEvent(): Promise<void>;
}

// Factory pattern to support both NPC and Character life steal
@provide(LifeStealableFactory)
class LifeStealableFactory {
  constructor(private spellCalculator: SpellCalculator, private socketMessaging: SocketMessaging) {}

  public create(caster: INPC | ICharacter, target: INPC | ICharacter): ILifeStealable {
    if (caster.type === EntityType.NPC) {
      return new NPCLifeStealable(caster as INPC, target as ICharacter, this.socketMessaging);
    } else {
      return new CharacterLifeStealable(caster as ICharacter, target, this.spellCalculator, this.socketMessaging);
    }
  }
}

class NPCLifeStealable implements ILifeStealable {
  constructor(private caster: INPC, private target: ICharacter, private socketMessaging: SocketMessaging) {}

  public calculateLifeSteal(): number {
    return random(1, this.caster.maxHealth * MAX_LIFE_STEAL_PERCENTAGE);
  }

  public async updateHealth(lifeStealAmount: number): Promise<void> {
    await NPC.updateOne({ _id: this.caster._id }, { $inc: { health: lifeStealAmount } });
  }

  public getEvent(): NPCSocketEvents {
    return NPCSocketEvents.NPCAttributeChanged;
  }

  public async sendLifeStealAmountEvent(): Promise<void> {
    const { health } = (await NPC.findById(this.caster._id).lean().select("health")) as INPC;

    const payload = {
      targetId: this.caster._id,
      health,
    };

    await this.socketMessaging.sendEventToCharactersAroundCharacter(this.target, this.getEvent(), payload, true);
  }
}

class CharacterLifeStealable implements ILifeStealable {
  constructor(
    private caster: ICharacter,
    private target: INPC | ICharacter,
    private spellCalculator: SpellCalculator,
    private socketMessaging: SocketMessaging
  ) {}

  public async calculateLifeSteal(): Promise<number> {
    return await this.spellCalculator.calculateBasedOnSkillLevel(this.caster, BasicAttribute.Magic, {
      min: 1,
      max: this.target.maxHealth * MAX_LIFE_STEAL_PERCENTAGE,
    });
  }

  public async updateHealth(lifeStealAmount: number): Promise<void> {
    await Character.updateOne({ _id: this.caster._id }, { $inc: { health: lifeStealAmount } });
  }

  public getEvent(): CharacterSocketEvents {
    return CharacterSocketEvents.AttributeChanged;
  }

  public getEventReceiver(): ICharacter {
    return this.caster;
  }

  public async sendLifeStealAmountEvent(): Promise<void> {
    const { health } = (await Character.findById(this.caster._id).lean().select("health")) as ICharacter;

    const payload = {
      targetId: this.caster._id,
      health,
    };
    await this.socketMessaging.sendEventToCharactersAroundCharacter(this.caster, this.getEvent(), payload);
  }
}
@provide(SpellLifeSteal)
export class SpellLifeSteal {
  constructor(private lifeStealableFactory: LifeStealableFactory) {}

  public async performLifeSteal(caster: INPC | ICharacter, target: ICharacter | INPC): Promise<void> {
    try {
      const lifeStealable = this.lifeStealableFactory.create(caster, target);

      const potentialLifeSteal = await lifeStealable.calculateLifeSteal();

      await lifeStealable.updateHealth(potentialLifeSteal);

      await lifeStealable.sendLifeStealAmountEvent();
    } catch (error) {
      console.error(error);
    }
  }
}
