import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { ICraftItemPayload, ILoadCraftBookPayload, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemCraftable } from "../ItemCraftable";

@provide(ItemNetworkCraftable)
export class ItemNetworkCraftable {
  constructor(private socketAuth: SocketAuth, private itemCraftable: ItemCraftable) {}

  public onCraftableItemsLoad(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.LoadCraftBook,
      async (data: ILoadCraftBookPayload, character) => {
        if (data) {
          await this.itemCraftable.loadCraftableItems(data.itemSubType, character);
        }
      }
    );
  }

  public onCraftItem(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, ItemSocketEvents.CraftItem, async (data: ICraftItemPayload, character) => {
      if (data) {
        const skills = (await Skill.findOne({ owner: character._id })
          .lean()
          .cacheQuery({
            cacheKey: `${character._id}-skills`,
          })) as ISkill;

        character.skills = skills;

        await this.itemCraftable.craftItem(data, character);
      }
    });
  }
}
