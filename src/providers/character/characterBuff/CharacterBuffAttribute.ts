import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { TextFormatter } from "@providers/text/TextFormatter";
import { CharacterSocketEvents, ICharacterBuff } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

import { CharacterBuffTracker } from "./CharacterBuffTracker";

@provide(CharacterBuffAttribute)
export class CharacterBuffAttribute {
  constructor(
    private characterBuffTracker: CharacterBuffTracker,
    private socketMessaging: SocketMessaging,
    private textFormatter: TextFormatter
  ) {}

  public async enableBuff(character: ICharacter, buff: ICharacterBuff): Promise<string> {
    // change character model attribute, based on specific trait

    const prevTraitValue = character[buff.trait] as number;

    const updatedTraitValue = prevTraitValue + prevTraitValue * (buff.buffPercentage / 100);

    // save model

    await Character.updateOne({ _id: character._id }, { [buff.trait]: updatedTraitValue });

    // then register the buff on redis (so we can rollback when needed)

    const buffId = await this.characterBuffTracker.addBuff(character, {
      ...buff,
      prevTraitValue,
    });

    if (!buffId) {
      throw new Error("Could not add buff to character");
    }

    // inform and send update to client
    await this.sendUpdateToClient(character, buff, updatedTraitValue);

    return buffId;
  }

  public async disableBuff(character: ICharacter, buffId: string): Promise<boolean> {
    // rollback model changes
    const buff = await this.characterBuffTracker.getBuff(character, buffId);

    if (!buff) {
      return false;
    }

    const prevTraitValue = buff.prevTraitValue as number;

    character[buff.trait] = prevTraitValue;

    // save model

    await Character.updateOne({ _id: character._id }, { [buff.trait]: prevTraitValue });

    // then delete the buff from redis

    await this.characterBuffTracker.deleteBuff(character, buff._id!);

    if (!buff.options?.messages?.skipAllMessages && !buff.options?.messages?.skipDeactivationMessage) {
      this.socketMessaging.sendMessageToCharacter(
        character,
        buff.options?.messages?.deactivation ||
          `Your ${this.textFormatter.convertCamelCaseToSentence(buff.trait)} buff has been removed!`
      );
    }

    // inform and send update to client
    this.sendUpdateToClient(character, buff, prevTraitValue);

    return true;
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
