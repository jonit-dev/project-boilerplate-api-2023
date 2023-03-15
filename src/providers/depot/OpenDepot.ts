import { Depot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Types } from "mongoose";
import { IItemContainer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(OpenDepot)
export class OpenDepot {
  constructor() {}

  /**
   * getContainer returns the depot container if exists. If it does not exist, creates a new one for the character
   * @param characterId of the character that makes the request
   * @param npcId of the NPC that has depot (hasDepot == true)
   * @returns the depot ItemContainer that corresponds to the character
   */
  public async getContainer(characterId: string, npcId: string): Promise<IItemContainer> {
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
        slotQty: 40,
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
}
