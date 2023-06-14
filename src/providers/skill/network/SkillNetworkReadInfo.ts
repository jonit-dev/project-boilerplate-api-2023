import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffSkill } from "@providers/character/characterBuff/CharacterBuffSkill";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IUIShowMessage, SkillSocketEvents, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SkillBuff } from "../SkillBuff";

@provide(SkillNetworkReadInfo)
export class SkillNetworkReadInfo {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private characterBuffSkill: CharacterBuffSkill,
    private skillBuff: SkillBuff
  ) {}

  public onGetInfo(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, SkillSocketEvents.ReadInfo, async (data, character: ICharacter) => {
      const skill = await this.skillBuff.getSkillsWithBuff(character);

      if (!skill) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "Skill not found.",
          type: "error",
        });
        return false;
      }

      const buffs = await this.characterBuffSkill.calculateAllActiveBuffs(character);

      this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
        skill,
        buffs,
      });
    });
  }
}
