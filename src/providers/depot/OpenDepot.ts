import { Depot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { IItemContainer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(OpenDepot)
export class OpenDepot {
  constructor(private newRelic: NewRelic) {}

  /**
   * getContainer returns the depot container if exists. If it does not exist, creates a new one for the character
   * @param characterId of the character that makes the request
   * @param npcId of the NPC that has depot (hasDepot == true)
   * @returns the depot ItemContainer that corresponds to the character
   */
  public async getContainer(characterId: string, npcId: string): Promise<IItemContainer> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "OpenDepot.getContainer",
      async () => {
        let itemContainer: IItemContainer;

        const npc = await NPC.findOne({
          _id: Types.ObjectId(npcId),
        }).lean();

        if (!npc) {
          throw new Error("NPC not found");
        }

        const depot = await Depot.findOne({
          owner: Types.ObjectId(characterId),
          key: npc.key,
        }).populate("itemContainer");

        if (depot) {
          itemContainer = depot.itemContainer as unknown as IItemContainer;
        } else {
          // Depot does not exist, create new one
          let newDepot = new Depot({
            owner: Types.ObjectId(characterId),
            key: npc.key,
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
    );
  }
}
