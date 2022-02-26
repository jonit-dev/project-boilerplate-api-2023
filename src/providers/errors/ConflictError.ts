import { HttpStatus } from "@rpg-engine/shared";
import { ApplicationError } from "./ApplicationError";

export class ConflictError extends ApplicationError {
  constructor(message) {
    super(message, HttpStatus.Conflict);

    this.error = ConflictError.name;
  }
}
