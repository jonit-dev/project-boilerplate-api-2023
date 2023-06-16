import { provide } from "inversify-binding-decorators";
import { MarketplaceItem } from "@entities/ModuleMarketplace/MarketplaceItemModel";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { MarketplaceValidation } from "./MarketplaceValidation";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import mongoose from "mongoose";
import { MarketplaceMoney } from "@entities/ModuleMarketplace/MarketplaceMoneyModel";
import { IMarketplaceGetItemsResponse, MarketplaceSocketEvents } from "@rpg-engine/shared";

interface IGetItemsOptions {
  name?: string;
  orderBy?: string;
  order?: string;
  owner?: string;
  mainLevel?: [number | undefined, number | undefined];
  secondaryLevel?: [number | undefined, number | undefined];
  price?: [number | undefined, number | undefined];
  itemType?: string;
  itemRarity?: string;
  limit?: number;
  page?: number;
}

@provide(MarketplaceGetItems)
export class MarketplaceGetItems {
  constructor(private marketplaceValidation: MarketplaceValidation, private socketMessaging: SocketMessaging) {}

  public async getItems(
    character: ICharacter,
    npcId: string,
    options: IGetItemsOptions = {}
  ): Promise<void | IMarketplaceGetItemsResponse> {
    const marketplaceValid = await this.marketplaceValidation.hasBasicValidation(character, npcId);
    if (!marketplaceValid) {
      return;
    }

    let pipeline: any[] = [
      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          as: "item",
        },
      },
      {
        $unwind: "$item",
      },
    ];

    if (options.name) {
      pipeline.push({
        $match: {
          "item.name": {
            $regex: new RegExp(options.name, "i"),
          },
        },
      });
    }

    if (options.owner && mongoose.isValidObjectId(options.owner)) {
      pipeline.push({
        $match: {
          owner: mongoose.Types.ObjectId(options.owner),
        },
      });
    }

    if (options.price) {
      pipeline.push({
        $match: {
          price: {
            $gte: options.price[0] || 0,
            $lte: options.price[1] || Infinity,
          },
        },
      });
    }

    if (options.itemType && options.itemType !== "Type") {
      pipeline.push({
        $match: {
          "item.subType": options.itemType,
        },
      });
    }

    if (options.itemRarity && options.itemRarity !== "Rarity") {
      pipeline.push({
        $match: {
          "item.rarity": options.itemRarity,
        },
      });
    }

    if (options.mainLevel) {
      let level = Infinity;
      if (options.mainLevel[1]) level = options.mainLevel[1] - 1;
      if (options.mainLevel[0]) level = -1;

      pipeline.push(
        {
          $addFields: {
            "item.minRequirements.level": {
              $ifNull: ["$item.minRequirements.level", level],
            },
          },
        },
        {
          $match: {
            "item.minRequirements.level": {
              $gte: options.mainLevel[0] || 0,
              $lte: options.mainLevel[1] || Infinity,
            },
          },
        }
      );
    }

    if (options.secondaryLevel) {
      let level = Infinity;
      if (options.secondaryLevel[1]) level = options.secondaryLevel[1] - 1;
      if (options.secondaryLevel[0]) level = -1;

      pipeline.push(
        {
          $addFields: {
            "item.minRequirements.skill.level": {
              $ifNull: ["$item.minRequirements.skill.level", level],
            },
          },
        },
        {
          $match: {
            "item.minRequirements.skill.level": {
              $gte: options.secondaryLevel[0] || 0,
              $lte: options.secondaryLevel[1] || Infinity,
            },
          },
        }
      );
    }

    if (options.orderBy) {
      const sortStage: any = { $sort: {} };
      sortStage.$sort[options.orderBy === "price" ? "price" : "item.name"] = options.order === "asc" ? 1 : -1;
      pipeline.push(sortStage);
    }

    const limit = options.limit || 10;
    const page = options.page || 1;
    const skip = (page - 1) * limit;

    pipeline.push({
      $facet: {
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "totalItems" }],
      },
    });

    const result = await MarketplaceItem.aggregate(pipeline);
    const items = result[0].paginatedResults;
    const totalItems = result[0].totalCount.length > 0 ? result[0].totalCount[0].totalItems : 0;

    const marketplaceMoney = await MarketplaceMoney.findOne({ owner: character._id });

    this.socketMessaging.sendEventToUser<IMarketplaceGetItemsResponse>(
      character.channelId!,
      MarketplaceSocketEvents.GetItems,
      {
        items,
        moneyAvailable: marketplaceMoney?.money || 0,
        totalItems,
      }
    );

    return {
      items,
      moneyAvailable: marketplaceMoney?.money || 0,
      totalItems,
    };
  }
}
