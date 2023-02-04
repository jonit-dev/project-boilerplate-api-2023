import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
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
    private characterView: CharacterView
  ) {}

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

  public async getCharactersInView(npc: INPC): Promise<ICharacter[]> {
    return await this.getElementsInNPCView(Character, npc, {
      isOnline: true,
    });
  }

  public async getNearestCharacter(npc: INPC): Promise<ICharacter | undefined | null> {
    return await this.characterView.getNearestCharactersFromXYPoint(npc.x, npc.y, npc.scene);
  }

  public async getNPCsInView(character: ICharacter, options?: IGetNPCsInViewOptions): Promise<INPC[]> {
    const npcsInView = await this.playerView.getElementsInCharView(NPC, character, {
      health: { $gt: 0 },
      isBehaviorEnabled: options?.isBehaviorEnabled ?? true,
    });

    return npcsInView;
  }
}
