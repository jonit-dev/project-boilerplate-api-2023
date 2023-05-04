import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { TextFormatter } from "@providers/text/TextFormatter";
import { CharacterSocketEvents, ICharacterBuff } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

import { CharacterBuffTracker } from "./CharacterBuffTracker";

export interface IBuffValueCalculations {
  baseTraitValue: number;
  buffAbsoluteChange: number;
  updatedTraitValue: number;
}

@provide(CharacterBuffAttribute)
export class CharacterBuffAttribute {
  constructor(
    private characterBuffTracker: CharacterBuffTracker,
    private socketMessaging: SocketMessaging,
    private textFormatter: TextFormatter
  ) {}

  public async enableBuff(character: ICharacter, buff: ICharacterBuff): Promise<ICharacterBuff> {
    const { buffAbsoluteChange, updatedTraitValue } = await this.performBuffValueCalculations(character, buff);

    // Save the absolute change in the buff object
    buff.absoluteChange = Number(buffAbsoluteChange.toFixed(2));

    // then register the buff on redis (so we can rollback when needed)

    const addedBuff = await this.characterBuffTracker.addBuff(character, buff);

    if (!addedBuff) {
      throw new Error("Could not add buff to character");
    }

    // finally, update on the model
    await Character.updateOne(
      { _id: character._id },
      {
        [buff.trait]: updatedTraitValue,
      }
    );

    // inform and send update to client
    this.sendUpdateToClient(character, buff, updatedTraitValue);

    return addedBuff;
  }

  public async disableBuff(character: ICharacter, buffId: string): Promise<boolean> {
    // rollback model changes
    const buff = await this.characterBuffTracker.getBuff(character, buffId);

    if (!buff) {
      return false;
    }

    const currentBuffValue = character[buff.trait];

    const debuffValue = buff.absoluteChange!;

    const updatedTraitValue = Number((currentBuffValue - debuffValue).toFixed(2));

    // then delete the buff from redis

    const hasDeletedBuff = await this.characterBuffTracker.deleteBuff(character, buff._id!);

    if (!hasDeletedBuff) {
      throw new Error("Could not delete buff from character");
    }

    await Character.updateOne(
      { _id: character._id },
      {
        [buff.trait]: updatedTraitValue,
      }
    );

    if (!buff.options?.messages?.skipAllMessages && !buff.options?.messages?.skipDeactivationMessage) {
      this.socketMessaging.sendMessageToCharacter(
        character,
        buff.options?.messages?.deactivation ||
          `Your ${this.textFormatter.convertCamelCaseToSentence(buff.trait)} buff has been removed!`
      );
    }

    // inform and send update to client
    this.sendUpdateToClient(character, buff, updatedTraitValue);

    return true;
  }

  private async performBuffValueCalculations(
    character: ICharacter,
    buff: ICharacterBuff
  ): Promise<IBuffValueCalculations> {
    const totalTraitSummedBuffs = await this.characterBuffTracker.getAllBuffAbsoluteChanges(character, buff.trait);

    const updatedCharacter = (await Character.findById(character._id).lean()) as ICharacter;

    if (!updatedCharacter) {
      throw new Error("Character not found");
    }

    const baseTraitValue = Number((updatedCharacter[buff.trait] - totalTraitSummedBuffs).toFixed(2));

    // Calculate the new buffed value by applying the percentage buff on the BASE VALUE (additive buff!)
    const updatedTraitValue =
      Number((baseTraitValue * (1 + buff.buffPercentage / 100)).toFixed(2)) + totalTraitSummedBuffs;

    // Calculate the absolute change of the new buff
    const buffAbsoluteChange = Number((updatedTraitValue - baseTraitValue).toFixed(2)) - totalTraitSummedBuffs;

    return {
      baseTraitValue,
      buffAbsoluteChange,
      updatedTraitValue,
    };
  }

  private sendUpdateToClient(character: ICharacter, buff: ICharacterBuff, updatedTraitValue: number): void {
    const clientTraitNames = {
      baseSpeed: "speed",
    };

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, {
      targetId: character._id,
      [clientTraitNames[buff.trait]]: updatedTraitValue,
    });

    if (!buff.options?.messages?.skipAllMessages && !buff.options?.messages?.skipActivationMessage) {
      this.socketMessaging.sendMessageToCharacter(
        character,
        buff.options?.messages?.activation ||
          `Your ${this.textFormatter.convertCamelCaseToSentence(buff.trait)} has been buffed by ${
            buff.buffPercentage
          }%!`
      );
    }
  }
}
