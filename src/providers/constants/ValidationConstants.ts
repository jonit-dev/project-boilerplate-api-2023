import { TranslationTypes, TypeHelper } from "@rpg-engine/shared/dist";
import { ValidationArguments } from "class-validator";
import { injectable } from "inversify";
import { TS } from "../translation/TranslationHelper";
import { IValidationTranslation } from "../types/ValidationTypes";

interface IEnum {
  [key: number]: string | number;
}

export declare interface ITSDecorator {
  getTranslation(context: TranslationTypes, key: string, optionalParams?: any): IValidationTranslation;
}

@injectable()
export class TsDefaultDecorator implements ITSDecorator {
  getTranslation(context: TranslationTypes, key: string, optionalParams?: any): IValidationTranslation {
    return {
      message: ({ property }: ValidationArguments): string =>
        TS.translate(context, key, {
          field: property,
          ...optionalParams,
        }),
    };
  }
}

export const tsDefaultDecorator = (
  context: TranslationTypes,
  key: string,
  optionalParams?: any
): IValidationTranslation => ({
  message: ({ property }: ValidationArguments): string =>
    TS.translate(context, key, {
      field: property,
      ...optionalParams,
    }),
});

export const tsEnumDecorator = (context: TranslationTypes, key: string, types: IEnum): IValidationTranslation => ({
  message: ({ property }: ValidationArguments): string =>
    TS.translate(context, key, {
      field: property,
      types: TypeHelper.enumToStringArray(types).join(", "),
    }),
});
