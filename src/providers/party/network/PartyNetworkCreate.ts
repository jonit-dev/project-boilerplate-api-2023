import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";

export interface IPartyManagementFromClient {
  leaderId?: string;
  leaderChannelId?: string;
  targetId?: string;
  targetChannelId?: string;
}

export enum PartySocketEvents {
  Create = "create",
  Leave = "leave",
  TransferLeadership = "transferLeadership",
  Invite = "invite",
}

interface IPartyResponseCreate {
  success?: ICharacterParty;
  failure?: string;
}

@provide(PartyNetworkCreate)
export class PartyNetworkCreate {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private partyManagement: PartyManagement,
    private characterValidation: CharacterValidation
  ) {}

  public onCreateParty(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.Create,
      async (data: IPartyManagementFromClient, character: ICharacter) => {
        try {
          const leader = (await Character.findById(character._id).lean()) as ICharacter;
          const leaderBasicValidation = this.characterValidation.hasBasicValidation(leader);

          const target = (await Character.findById(data.targetId).lean()) as ICharacter;
          const targetBasicValidation = this.characterValidation.hasBasicValidation(target);

          if (leaderBasicValidation || targetBasicValidation) {
            console.log("ERROR");
          }

          const createParty = await this.partyManagement.createParty(leader, target);

          if (!createParty) {
            const msg: IPartyResponseCreate = {
              failure: "Error creating party",
            };

            this.socketMessaging.sendEventToUser<IPartyResponseCreate>(
              leader.channelId!,
              PartySocketEvents.Create,
              msg
            );

            return;
          }

          const msg: IPartyResponseCreate = {
            success: createParty,
          };

          this.socketMessaging.sendEventToUser<IPartyResponseCreate>(leader.channelId!, PartySocketEvents.Create, msg);

          this.socketMessaging.sendEventToUser<IPartyResponseCreate>(target.channelId!, PartySocketEvents.Create, msg);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
