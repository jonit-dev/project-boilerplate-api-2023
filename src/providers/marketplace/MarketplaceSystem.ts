import { IMarketplace, Marketplace } from "@entities/ModuleMarketplace/MarketplaceModel";
import { IItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(MarketplaceSystem)
export class MarketplaceSystem {
  constructor() {}

  public async addItems(id: string, items: Partial<IItem>[]): Promise<void> {
    if (!items.length) {
      throw new Error("No items to add");
    }
    const marketplace = await this.getMarketplace(id);
    if (!marketplace.open) {
      throw new Error(`Marketplace with id ${id} is closed. Cannot add items to a closed Marketplace`);
    }
    const currentItems: Partial<IItem>[] = (marketplace.items as any) || [];
    const updatedItems = this.getUniqueItems(currentItems, items);
    await Marketplace.findByIdAndUpdate(id, { items: updatedItems as any });
  }

  public async openMarketplace(id: string): Promise<void> {
    const marketplace = await Marketplace.findByIdAndUpdate(id, { open: true });
    if (!marketplace) {
      throw new Error(`Marketplace with id ${id} does not exist`);
    }
  }

  public async closeMarketplace(id: string): Promise<void> {
    const marketplace = await Marketplace.findByIdAndUpdate(id, { open: false });
    if (!marketplace) {
      throw new Error(`Marketplace with id ${id} does not exist`);
    }
  }

  public async getMarketplace(id: string): Promise<IMarketplace> {
    const marketplace = await Marketplace.findById(id);
    if (!marketplace) {
      throw new Error(`Marketplace with id ${id} does not exist`);
    }
    return marketplace;
  }

  private getUniqueItems(currentItems: Partial<IItem>[], newItems: Partial<IItem>[]): Partial<IItem>[] {
    const currentItemsKeys = currentItems.map((i) => i.key);
    for (const ni of newItems) {
      if (currentItemsKeys.includes(ni.key)) {
        continue;
      }
      currentItemsKeys.push(ni.key);
      currentItems.push(ni);
    }
    return currentItems;
  }
}
