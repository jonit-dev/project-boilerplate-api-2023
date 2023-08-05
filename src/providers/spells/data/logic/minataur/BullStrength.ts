import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { characterBuffActivator } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  ShadowWalkerRaces,
  ICharacterAttributeChanged,
  CharacterSocketEvents,
  CharacterBuffType,
  BasicAttribute,
  CharacterBuffDurationType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(BullStrength)
export class BullStrength {
  constructor(private socketMessaging: SocketMessaging) {}

  public async handleBullStrength(character: ICharacter, buffPercentage: number, timeout: number): Promise<void> {
    try {
      if (!character || character.race !== ShadowWalkerRaces.Minotaur) {
        return;
      }
      await Promise.all([
        characterBuffActivator.enableTemporaryBuff(character, {
          type: CharacterBuffType.Skill,
          trait: BasicAttribute.Strength,
          buffPercentage,
          durationSeconds: timeout,
          durationType: CharacterBuffDurationType.Temporary,
          isStackable: false,
          originateFrom: SpellsBlueprint.MinotaurBullStrength,
          options: {
            messages: {
              skipAllMessages: true,
            },
          },
        }),
        await this.enableGiantForm(character, timeout),
      ]);
    } catch (error) {
      console.error(`Failed to handle set character to giant form: ${error}`);
    }
  }

  private async enableGiantForm(character: ICharacter, timeout: number): Promise<void> {
    character.isGiantForm = true;
    await character.save();

    const payload: ICharacterAttributeChanged = {
      targetId: character._id,
      isGiantForm: true,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
    this.socketMessaging.sendMessageToCharacter(character, "You have become a giant!");
    setTimeout(async () => {
      await this.disableGiantForm(character);
    }, timeout * 1000);
  }

  private async disableGiantForm(character: ICharacter): Promise<void> {
    character.isGiantForm = false;
    await character.save();
    const payload: ICharacterAttributeChanged = {
      targetId: character._id,
      isGiantForm: false,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
    this.socketMessaging.sendMessageToCharacter(character, "You turn back to normal!");
  }
}
