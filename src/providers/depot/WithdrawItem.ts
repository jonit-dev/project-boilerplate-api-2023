import { IItemContainer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { OpenDepot } from "./OpenDepot";

@provide(WithdrawItem)
export class WithdrawItem {
  constructor(private openDepot: OpenDepot) {}

  public async withdraw(
    characterId: string,
    npcId: string,
    itemId: string,
    toContainerId?: string
  ): Promise<IItemContainer> {
    const itemContainer = await this.openDepot.getContainer(characterId, npcId);

    return itemContainer;
  }
}
