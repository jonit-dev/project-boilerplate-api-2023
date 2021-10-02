import { ValidationArguments } from "class-validator";

export interface IValidationTranslation {
  // eslint-disable-next-line unused-imports/no-unused-vars
  message: ({ property }: ValidationArguments) => string;
}
