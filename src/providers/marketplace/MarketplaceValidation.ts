import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { MAX_DISTANCE_TO_NPC_IN_GRID } from "@providers/constants/DepotConstants";
import { BLOCKED_ITEMS_KEY_FOR_MARKETPLACE } from "@providers/constants/MarketplaceConstants";
import { DepotSystem } from "@providers/depot/DepotSystem";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";

@provide(MarketplaceValidation)
export class MarketplaceValidation {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private depotSystem: DepotSystem,
    private movementHelper: MovementHelper,
    private mapNonPVPZone: MapNonPVPZone
  ) {}

  @TrackNewRelicTransaction()
  public async hasBasicValidation(character: ICharacter, npcId: string): Promise<boolean> {
    const characterValid = this.characterValidation.hasBasicValidation(character);
    if (!characterValid) {
      return false;
    }

    if (npcId === "") {
      return true;
    }

    const npc = await this.depotSystem.npcBasicValidation(npcId);
    if (!npc) {
      this.socketMessaging.sendErrorMessageToCharacter(character, `NPC with id ${npcId} does not exist`);
      return false;
    }

    // Check if position is at npc's reach
    const isUnderRange = this.movementHelper.isUnderRange(
      character.x,
      character.y,
      npc.x,
      npc.y,
      MAX_DISTANCE_TO_NPC_IN_GRID
    );
    if (!isUnderRange) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "NPC out of reach...");
      return false;
    }

    return true;
  }

  public isItemValid(item: IItem): boolean {
    return !BLOCKED_ITEMS_KEY_FOR_MARKETPLACE.includes(item.key);
  }
}
