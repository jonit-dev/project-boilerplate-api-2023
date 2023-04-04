import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";
import { Model } from "mongoose";

@provide(PartiallyCachedModel)
export class PartiallyCachedModel {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async get<T>(
    cacheNamespace: string,
    model: Model<any, any>,
    id: string,
    nonCachedFields: string,
    populate?: string
  ): Promise<T> {
    // first time caching the whole instance

    let cachedData = (await this.inMemoryHashTable.get(cacheNamespace, id)) as any;

    if (!cachedData) {
      cachedData = model.findById(id).lean({ virtuals: true, defaults: true });

      if (populate) {
        cachedData = cachedData.populate(populate);
      }

      await cachedData.exec();

      await this.inMemoryHashTable.set(cacheNamespace, id, cachedData);

      return cachedData as T;
    }

    if (!nonCachedFields) {
      return cachedData;
    }

    const partialData = await model.findById(id).select(nonCachedFields).lean({ virtuals: true, defaults: true });

    const fullData = {
      ...cachedData,
      ...partialData,
    };

    return fullData;
  }
}
