import { IItem } from "@entities/ModuleInventory/ItemModel";
import { provide } from "inversify-binding-decorators";

@provide(ItemLoader)
export class ItemLoader {
  public static ItemMetaData = new Map<string, IItem>();

  public async load(): Promise<void> {}
}
