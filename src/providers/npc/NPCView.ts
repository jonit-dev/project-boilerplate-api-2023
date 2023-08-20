import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterView } from "@providers/character/CharacterView";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";

interface IElementWithPosition {
  x: number;
  y: number;
}

interface IGetNPCsInViewOptions {
  isBehaviorEnabled?: boolean;
}

@provide(NPCView)
export class NPCView {
  constructor(
    private playerView: CharacterView,
    private socketTransmissionZone: SocketTransmissionZone,
    private characterView: CharacterView,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  @TrackNewRelicTransaction()
  public async getElementsInNPCView<T extends IElementWithPosition>(
    // @ts-ignore
    Element: Model<T>,
    npc: INPC,
    filter?: Record<string, unknown>
  ): Promise<T[]> {
    const socketTransmissionZone = this.socketTransmissionZone.calculateSocketTransmissionZone(
      npc.x,
      npc.y,
      GRID_WIDTH,
      GRID_HEIGHT,
      SOCKET_TRANSMISSION_ZONE_WIDTH,
      SOCKET_TRANSMISSION_ZONE_WIDTH
    );

    // @ts-ignore
    const otherElementsInView = await Element.find({
      $and: [
        {
          x: {
            $gte: socketTransmissionZone.x,
            $lte: socketTransmissionZone.width,
          },
        },
        {
          y: {
            $gte: socketTransmissionZone.y,
            $lte: socketTransmissionZone.height,
          },
        },
        {
          scene: npc.scene,
          ...filter,
        },
      ],
    }).lean({ virtuals: true, defaults: true }); //! Virtual required until we have quadtrees
    return otherElementsInView as unknown as T[];
  }

  @TrackNewRelicTransaction()
  public async getCharactersInView(npc: INPC): Promise<ICharacter[]> {
    return await this.getElementsInNPCView(Character, npc, {
      isOnline: true,
    });
  }

  @TrackNewRelicTransaction()
  public async getNearestCharacter(npc: INPC): Promise<ICharacter | undefined | null> {
    return await this.characterView.getNearestCharactersFromXYPoint(npc.x, npc.y, npc.scene);
  }

  @TrackNewRelicTransaction()
  public async getNPCsInView(character: ICharacter, options?: IGetNPCsInViewOptions): Promise<INPC[]> {
    const npcsInView = await this.playerView.getElementsInCharView(NPC, character, {
      health: { $gt: 0 },
    });

    if (!npcsInView.length) {
      return [];
    }

    const namespace = "isBehaviorEnabled";

    const npcIds = npcsInView.map((npc) => npc.id);
    const behaviorStatuses = await this.inMemoryHashTable.batchGet(namespace, npcIds);

    const isBehaviorFilter = options?.isBehaviorEnabled ?? true;

    // Filter NPCs based on their behavior statuses
    return npcsInView.filter((npc) => (behaviorStatuses[npc.id] || false) === isBehaviorFilter);
  }
}
