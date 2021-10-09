import { HttpStatus } from "@project-remote-job-board/shared";

import { ApplicationError } from "./ApplicationError";

export class ForbiddenError extends ApplicationError {
  constructor(message) {
    super(message, HttpStatus.Forbidden);

    this.error = ForbiddenError.name;
  }
}
