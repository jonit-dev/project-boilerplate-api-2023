import { Depot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Types } from "mongoose";
import { IItemContainer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";

@provide(DepotSystem)
export class DepotSystem {
  constructor() {}

  /**
   * npcBasicValidation validates if the NPC exists and has depot
   * If validation passes, returns the corresponding NPC
   * @param npcId
   * @returns NPC entity if validation pass
   */
  public async npcBasicValidation(npcId: string): Promise<INPC> {
    const npc = await NPC.findOne({
      _id: npcId,
    });

    if (!npc) {
      throw new Error(`DepotSystem > NPC not found: ${npcId}`);
    }

    if (!npc.hasDepot) {
      throw new Error(`DepotSystem > NPC does not support depot ('hasDepot' = false): NPC id ${npcId}`);
    }
    return npc;
  }

  /**
   * getDepotContainer returns the depot container if exists. If it does not exist, creates a new one for the character
   * @param characterId of the character that makes the request
   * @param npcId of the NPC that has depot (hasDepot == true)
   * @returns the depot ItemContainer that corresponds to the character
   */
  public async getDepotContainer(characterId: string, npcId: string): Promise<IItemContainer> {
    let itemContainer: IItemContainer;

    const depot = await Depot.findOne({
      owner: Types.ObjectId(characterId),
      npc: Types.ObjectId(npcId),
    })
      .populate("itemContainer")
      .exec();

    if (depot) {
      itemContainer = depot.itemContainer as unknown as IItemContainer;
    } else {
      // Depot does not exist, create new one
      let newDepot = new Depot({
        owner: Types.ObjectId(characterId),
        npc: Types.ObjectId(npcId),
      });

      newDepot = await newDepot.save();
      let depotItemContainer = new ItemContainer({
        parentItem: newDepot._id,
        name: "Depot",
      });
      depotItemContainer = await depotItemContainer.save();

      await Depot.updateOne(
        {
          _id: newDepot._id,
        },
        {
          $set: {
            itemContainer: depotItemContainer._id,
          },
        }
      );

      itemContainer = depotItemContainer as unknown as IItemContainer;
    }
    return itemContainer;
  }

  public async depositItem(characterId: string, npcId: string, itemId: string): Promise<IItemContainer> {
    const itemContainer = await this.getDepotContainer(characterId, npcId);

    return itemContainer;
  }

  public async withdrawItem(characterId: string, npcId: string, itemId: string): Promise<IItemContainer> {
    const itemContainer = await this.getDepotContainer(characterId, npcId);

    return itemContainer;
  }
}
