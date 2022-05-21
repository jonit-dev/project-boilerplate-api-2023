import { provide } from "inversify-binding-decorators";

//! Main goal of a loader is to merge Tiled data with our blueprints data.

@provide(ItemLoader)
export class ItemLoader {
  public async load(): Promise<void> {}
}
