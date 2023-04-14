import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";

@provide(CacheModel)
export class CacheModel {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async set(model: Model<any, any>, cacheNamespace: string, id: string, populate?: string): Promise<void> {
    await this.queryAndSetCache(model, cacheNamespace, id, populate);
  }

  // Get the cache if exists, otherwise query the model and cache it
  public async getOrQuery<T>(
    model: Model<any, any>,
    cacheNamespace: string,
    id: string,
    populate?: string
  ): Promise<T> {
    const cachedData = (await this.inMemoryHashTable.get(cacheNamespace, id)) as T;

    if (!cachedData) {
      // if no cache found, perform a query and cache it
      const modelData = await this.queryAndSetCache(model, cacheNamespace, id, populate);

      return modelData as T;
    }

    return cachedData;
  }

  public async delete(cacheNamespace: string, id: string): Promise<void> {
    await this.inMemoryHashTable.delete(cacheNamespace, id);
  }

  public async clear(cacheNamespace: string): Promise<void> {
    await this.inMemoryHashTable.deleteAll(cacheNamespace);
  }

  private async queryAndSetCache<T>(
    model: Model<any, any>,
    cacheNamespace: string,
    id: string,
    populate?: string
  ): Promise<T> {
    const modelData = await this.queryModel(model, id, populate);

    await this.inMemoryHashTable.set(cacheNamespace, id, modelData);

    const cachedData = await this.inMemoryHashTable.get(cacheNamespace, id);

    return cachedData as T;
  }

  private async queryModel<T>(model: Model<any, any>, id: string, populate?: string): Promise<T> {
    let modelData = model.findById(id).lean({ virtuals: true, defaults: true });

    if (populate) {
      modelData = modelData.populate(populate);
    }

    const result = await modelData.exec();

    return result as T;
  }
}
