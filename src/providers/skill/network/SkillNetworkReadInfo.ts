import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { ISkill, IUIShowMessage, SkillSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(SkillNetworkReadInfo)
export class SkillNetworkReadInfo {
  constructor(private socketAuth: SocketAuth, private socketMessaging: SocketMessaging) {}

  public onGetInfo(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, SkillSocketEvents.ReadInfo, async (character: ICharacter) => {
      const skill = await Skill.find({
        owner: character._id,
      });

      if (!skill) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "Skill not found.",
          type: "error",
        });
        return false;
      }

      this.socketMessaging.sendEventToUser<ISkill>(
        character.channelId!,
        SkillSocketEvents.ReadInfo,
        skill as unknown as ISkill
      );
    });
  }
}
