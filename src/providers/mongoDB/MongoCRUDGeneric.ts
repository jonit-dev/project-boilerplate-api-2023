import { IUser } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Document, FilterQuery, Model, PaginateResult } from "mongoose";
import pluralize from "pluralize";

import { ConflictError } from "../errors/ConflictError";
import { InternalServerError } from "../errors/InternalServerError";
import { TS } from "../translation/TranslationHelper";

@provide(CRUD)
export class CRUD {
  constructor(private analytics: AnalyticsHelper) {}

  public isObjectIdValid(_id: string, modelName: string): boolean | Error {
    const id = String(_id); // just to guarantee that the string is actually an Id! If not done, sometimes it's being passed as ObjectID and causing issues with the verification below

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new InternalServerError(
        TS.translate("validation", "requiredResourceCreate", {
          field: modelName,
        })
      );
    }

    return true;
  }

  public async create<T extends Document>(
    Model: Model<T>,
    props,
    populateKeys?: string[] | null,
    uniqueBy?: string[] | null,
    user?: IUser | null
  ): Promise<T> {
    if (uniqueBy) {
      let uniqueQuery;

      if (user && user._id) {
        uniqueQuery = {
          owner: user._id,
        } as unknown as FilterQuery<T>;
      }

      for (const field of uniqueBy) {
        uniqueQuery = {
          ...uniqueQuery,
          [field]: props[field],
        };
      }

      const exists = await Model.exists(uniqueQuery);

      if (exists) {
        throw new ConflictError(
          TS.translate("validation", "alreadyExists", {
            field: Model.modelName,
          })
        );
      }
    }

    try {
      const newRecord = new Model({
        ...props,
      });

      await newRecord.save();

      if (user) {
        this.analytics.track(`Create${Model.modelName}`, user);
      }

      if (populateKeys) {
        for (const key of populateKeys) {
          await newRecord.populate(key).execPopulate();
        }
      }

      return newRecord;
    } catch (error: any) {
      console.error(error);

      if (error.message.includes("duplicate key")) {
        throw new ConflictError(
          TS.translate("validation", "alreadyExists", {
            field: Model.modelName,
          })
        );
      }

      throw new InternalServerError(
        `${TS.translate("validation", "creationError", {
          field: Model.modelName,
        })} ${error.message}`
      );
    }
  }

  public async readOne<T extends Document>(
    Model: Model<T>,
    filters,
    populateKeys?: string[] | null,
    user?: IUser | null
  ): Promise<T> {
    try {
      if (filters._id) {
        this.isObjectIdValid(filters._id, Model.modelName);
      }

      filters = this.getRegexFilters(filters);

      // @ts-ignore
      const record = await Model.findOne(filters);

      if (populateKeys) {
        for (const key of populateKeys) {
          await record?.populate(key).execPopulate();
        }
      }

      if (!record) {
        throw new NotFoundError(TS.translate("validation", "notFound", { field: Model.modelName }));
      }

      if (user) {
        this.analytics.track(`ReadOne${Model.modelName}`, user);
      }

      return record;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  public async readAll<T extends Document>(
    Model: Model<T>,
    filters,
    populateKeys?: string[] | false,
    sort?: Record<string, unknown> | null,
    isLean: boolean = true,
    limit?: number | null,
    user?: IUser | null
  ): Promise<T[]> {
    try {
      let records;

      filters = this.getRegexFilters(filters);

      if (limit) {
        records = Model.find(filters).limit(limit);
      } else {
        records = Model.find(filters);
      }

      if (sort) {
        records.sort(sort);
      }

      if (isLean && !populateKeys) {
        // we cannot use .lean() if we're going to populate later, because to do so we need a mongoose Document, not a plain obj.
        records.lean();
      }

      const results = await records.exec();

      if (populateKeys) {
        for (const key of populateKeys) {
          for (const record of results) {
            await record?.populate(key).execPopulate();
          }
        }
      }

      if (!results) {
        throw new NotFoundError(TS.translate("validation", "notFound", { field: Model.modelName }));
      }

      if (user) {
        this.analytics.track(`ReadAll${pluralize(Model.modelName)}`, user);
      }

      return results;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  public async readAllPaginated<T extends Document>(
    Model: Model<any>,
    filters,
    populateKeys?: string[] | null,
    sort?: Record<string, unknown> | null,
    isLean: boolean = true,
    offset?: number | null,
    limit?: number | null,
    page?: number | null
  ): Promise<PaginateResult<T>> {
    //! Note that to use this method the Model must have a plugin called mongoose-paginate-v2 enabled. See JobPostModel.ts for an example.

    console.log(`looking page ${page}`);

    console.log(filters);

    let options = {
      sort,
      populate: populateKeys,
      lean: isLean,
      offset: offset ?? 0,
      limit: limit ?? 10,
      page: page ?? 1,
    } as Record<string, unknown>;

    options = _.omitBy(options, _.isNil); // remove null or undefined values

    console.log(options);

    // @ts-ignore
    const results = await Model.paginate(filters, options);

    return results;
  }

  public async update<T extends Document>(
    Model: Model<T>,
    id,
    updateFields,
    populateKeys?: string[] | null,
    user?: IUser
  ): Promise<T> {
    this.isObjectIdValid(id, Model.modelName);

    try {
      const model = await Model.findById(id);

      if (!model) {
        throw new NotFoundError(TS.translate("validation", "notFound", { field: Model.modelName }));
      }

      for (const [key, value] of Object.entries(updateFields)) {
        model[key] = value;
      }

      if (user) {
        this.analytics.track(`UpdateOne${Model.modelName}`, user);
      }

      await model.save();

      if (populateKeys) {
        for (const key of populateKeys) {
          await model.populate(key).execPopulate();
        }
      }

      return model;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async updateReferenceArray<P extends Document, R extends Document>(
    ParentModel: Model<P>,
    parentId: string,
    ReferenceModel: Model<R>,
    referenceFieldName: string,
    updateArray,
    uniqueByKey?: string,
    recreateData: boolean = true
  ): Promise<void> {
    this.isObjectIdValid(parentId, ParentModel.modelName);

    this.isObjectIdValid(parentId, ReferenceModel.modelName);

    const nothingToUpdate = _.isEmpty(updateArray);
    if (nothingToUpdate) {
      throw new Error("Update fields are empty, aborting...");
    }

    const parent = await ParentModel.findById(parentId);

    if (!parent) {
      throw new NotFoundError(TS.translate("validation", "notFound", { field: ParentModel.modelName }));
    }

    const referenceIds = parent[referenceFieldName];

    // this will wipe out all fields and insert everything again with a new id
    if (_.isEmpty(referenceIds) || recreateData) {
      if (referenceIds) {
        // delete references
        for (const id of referenceIds) {
          await ReferenceModel.deleteOne({ _id: id });
        }
      }

      // @ts-ignore
      await ParentModel.updateOne({ _id: parentId }, { [referenceFieldName]: [] }); // clear all references ids

      // create new field and set new references

      for (const field of updateArray) {
        const newField = new ReferenceModel({ ...field });
        await newField.save();
        parent[referenceFieldName]?.push(newField._id);
        await parent.save();
      }
    } else {
      if (!uniqueByKey) {
        console.log("CRUD Error: Trying to update array without uniqueByKey variable");
        return;
      }

      for (const id of referenceIds) {
        const reference = await ReferenceModel.findById(id);

        if (!reference) {
          console.log("CRUD Error: failed to find reference to update...");
          return;
        }

        const updatedReference = updateArray.find((elm) => elm[uniqueByKey] === reference[uniqueByKey]);

        await ReferenceModel.updateOne({ _id: reference.id }, { ...updatedReference });
      }
    }
  }

  public async updateReference<T extends Document, R extends Document>(
    ParentModel: Model<T>,
    parentId: string,
    ReferenceModel: Model<R>,
    referenceFieldName: string,
    updateFields,
    populateKeys?: string[]
  ): Promise<T> {
    this.isObjectIdValid(parentId, ParentModel.modelName);

    this.isObjectIdValid(parentId, ReferenceModel.modelName);

    const nothingToUpdate = _.isEmpty(updateFields);
    if (nothingToUpdate) {
      throw new Error("Update fields are empty, aborting...");
    }

    try {
      const parentModel = await ParentModel.findById(parentId).populate([referenceFieldName]);

      if (!parentModel) {
        throw new NotFoundError(TS.translate("validation", "notFound", { field: ParentModel.modelName }));
      }

      // check if reference exists. If not, create a new one with our new fields.

      const referenceModel = parentModel[referenceFieldName];

      let doesReferenceExists;

      if (!referenceModel) {
        doesReferenceExists = false;
      } else {
        doesReferenceExists = await ReferenceModel.exists({ _id: referenceModel._id });
      }

      if (!doesReferenceExists) {
        await this.createAndUpdateReference(ReferenceModel, referenceFieldName, ParentModel, parentId, updateFields);
      } else {
        // if it exists, just update it!
        await ReferenceModel.updateOne({ _id: referenceModel._id }, { ...updateFields });
      }

      if (populateKeys) {
        for (const key of populateKeys) {
          await parentModel.populate(key).execPopulate();
        }
      }

      return parentModel;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete<T extends Document>(Model: Model<T>, id, user?: IUser): Promise<void> {
    this.isObjectIdValid(id, Model.modelName);

    try {
      const model = await Model.findOneAndDelete({
        _id: id,
      });

      if (!model) {
        throw new NotFoundError(TS.translate("validation", "notFound", { field: Model.modelName }));
      }

      if (user) {
        this.analytics.track(`Delete${Model.modelName}`, user);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async createAndUpdateReference<R extends Document>(
    ReferenceModel: Model<R>,
    referenceFieldName: string,
    ParentModel,
    parentId,
    updateFields
  ): Promise<R> {
    const newReferenceModel = new ReferenceModel({
      ...updateFields,
    });
    await newReferenceModel.save();

    await ParentModel.updateOne(
      { _id: parentId },
      {
        [referenceFieldName]: newReferenceModel._id,
      }
    );

    return newReferenceModel;
  }

  private getRegexFilters(filters: Record<string, unknown>): Record<string, unknown> {
    const regexFilters: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (key === "_id") {
        regexFilters[key] = value as string;
        continue;
      }

      regexFilters[key] = { $regex: new RegExp(value as string), $options: "i" };
    }

    return regexFilters;
  }
}
