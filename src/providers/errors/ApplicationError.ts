import { TS } from "../translation/TranslationHelper";

export class ApplicationError extends Error {
  public statusCode: number;
  public error: string;
  constructor(message, statusCode: number) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.message = message || TS.translate("error", "genericError");

    this.statusCode = statusCode || 500;
  }
}
