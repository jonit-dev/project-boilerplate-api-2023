import { appEnv } from "@providers/config/env";
import { provide } from "inversify-binding-decorators";
import { Document, FilterQuery, Model, Query } from "mongoose";

export type LeanOptions = "no-lean" | "lean" | "leanWithVirtualsAndDefaults";

export interface ILeanCRUDOptions {
  leanType?: LeanOptions;
  select?: string;
  populate?: string;
  activateMiddleware?: boolean;
}

export const defaultLeanCRUDOptions = {
  leanType: "leanWithVirtualsAndDefaults",
  activateMiddleware: !appEnv.general.IS_UNIT_TEST,
} as ILeanCRUDOptions;
@provide(LeanCRUD)
export class LeanCRUD {
  constructor() {}

  public async findOne<T extends Document>(
    EntityModel: Model<any>,
    filter: FilterQuery<T>,
    options: ILeanCRUDOptions = defaultLeanCRUDOptions,
    middleware?: (entity: T) => Promise<T>
  ): Promise<T | undefined> {
    try {
      const query = this.buildQuery(EntityModel, filter, options);

      let result = await query.findOne().exec();

      if (middleware && options.activateMiddleware && result) {
        result = await middleware(result);
      }

      return result as T;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById<T extends Document>(
    EntityModel: Model<T>,
    id: string,
    options: ILeanCRUDOptions = defaultLeanCRUDOptions,
    middleware?: (entity: T) => Promise<T>
  ): Promise<T | undefined> {
    return await this.findOne(EntityModel, { _id: id } as FilterQuery<T>, options, middleware);
  }

  public async findByIdAndUpdate<T extends Document>(
    EntityModel: Model<any>,
    id: string,
    update: Partial<T>,
    options = defaultLeanCRUDOptions,
    middleware?: (entity: T) => Promise<T>
  ): Promise<T | undefined> {
    try {
      const result = await EntityModel.findByIdAndUpdate(id, update as any, { new: true });

      if (middleware && options.activateMiddleware && result) {
        return await middleware(result);
      }

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async find<T extends Document>(
    EntityModel: Model<any>,
    filter: FilterQuery<T>,
    options: ILeanCRUDOptions = defaultLeanCRUDOptions,
    middleware?: (entity: T) => Promise<T>
  ): Promise<T[]> {
    try {
      const query = this.buildQuery(EntityModel, filter, options);

      let results = await query.exec();

      if (middleware && options.activateMiddleware && results.length) {
        results = await Promise.all(results.map((result) => middleware(result)));
      }

      return results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private buildQuery<T extends Document>(
    EntityModel: Model<any>,
    filter: FilterQuery<T>,
    options: ILeanCRUDOptions
  ): Query<T[], T> {
    let query =
      options.leanType === "no-lean" || options.populate
        ? EntityModel.find(filter)
        : EntityModel.find(filter).lean({
            virtuals: options.leanType === "leanWithVirtualsAndDefaults",
            defaults: options.leanType === "leanWithVirtualsAndDefaults",
          });

    if (options.populate) {
      query = query.populate(options.populate);
    }

    if (options.select) {
      query = query.select(options.select);
    }

    return query;
  }
}
