import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";
import { CharacterValidation } from "@providers/character/CharacterValidation";

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

interface ICharacterPartyChange {
  leader: {
    name: string;
  };
  members: Array<{
    name: string;
  }>;
  maxSize: number;
  benefits?: Array<{
    benefit: string;
    value: number;
  }>;
}

enum CharacterSocketEvents {
  PartyChange = "PartyChange",
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
          // const leaderBasicValidation = this.characterValidation.hasBasicValidation(leader);

          const target = (await Character.findById(data.targetId).lean()) as ICharacter;
          // const targetBasicValidation = this.characterValidation.hasBasicValidation(target);

          // if (leaderBasicValidation || targetBasicValidation) {
          //   console.log("ERROR");
          // }

          const createParty = await this.partyManagement.createParty(leader, target);

          if (!createParty) {
            return;
          }

          const partyPayload = await this.partyManagement.getPartyByCharacterId(leader._id);

          const payload: ICharacterPartyChange = {
            leader: { name: leader.name },
            members: [{ name: target.name }],
            maxSize: partyPayload!.maxSize,
            benefits: partyPayload!.benefits,
          };

          this.socketMessaging.sendEventToUser(leader.channelId!, CharacterSocketEvents.PartyChange, payload);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
