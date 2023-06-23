import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { IPartyManagementFromClient, PartySocketEvents } from "./PartyNetworkCreate";

@provide(PartyNetworkLeave)
export class PartyNetworkLeave {
  constructor(
    private socketAuth: SocketAuth,
    private partyManagement: PartyManagement,
    private characterValidation: CharacterValidation
  ) {}

  public onLeaveParty(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.Leave,
      async (data: IPartyManagementFromClient, character: ICharacter) => {
        try {
          const leader = (await Character.findById(character._id).lean()) as ICharacter;
          const leaderBasicValidation = this.characterValidation.hasBasicValidation(leader);

          const target = (await Character.findById(data.targetId).lean()) as ICharacter;
          const targetBasicValidation = this.characterValidation.hasBasicValidation(target);

          if (leaderBasicValidation || targetBasicValidation) {
            console.log("ERROR");
          }

          await this.partyManagement.leaveParty(leader, target);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
