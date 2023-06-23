import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { IPartyManagementFromClient, PartySocketEvents } from "./PartyNetworkCreate";

@provide(PartyNetworkTranferLeaderShip)
export class PartyNetworkTranferLeaderShip {
  constructor(
    private socketAuth: SocketAuth,
    private partyManagement: PartyManagement,
    private characterValidation: CharacterValidation
  ) {}

  public onTranferLeaderShip(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.TransferLeadership,
      async (data: IPartyManagementFromClient, character: ICharacter) => {
        try {
          const leader = (await Character.findById(character._id).lean()) as ICharacter;
          const leaderBasicValidation = this.characterValidation.hasBasicValidation(leader);

          const target = (await Character.findById(data.targetId).lean()) as ICharacter;
          const targetBasicValidation = this.characterValidation.hasBasicValidation(target);

          if (leaderBasicValidation || targetBasicValidation) {
            console.log("ERROR");
          }

          await this.partyManagement.transferLeadership(leader, target);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
