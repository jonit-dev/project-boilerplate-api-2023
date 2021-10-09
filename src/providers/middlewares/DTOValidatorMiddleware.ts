import { HttpStatus, IValidationError } from "@project-remote-job-board/shared";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

import { BadRequestError } from "../errors/BadRequestError";

export const DTOValidatorMiddleware = (dtoClass: any) => {
  return function (req: Request, res: Response, next: NextFunction): any {
    const output = plainToClass(dtoClass, req.body);

    // eslint-disable-next-line promise/catch-or-return
    validate(output, {
      skipMissingProperties: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }).then((errors: IValidationError[]) => {
      // errors is an array of validation errors
      // eslint-disable-next-line promise/always-return
      if (errors.length > 0) {
        const errorList: string[] = [];
        for (const validationError of errors) {
          console.log(validationError);

          const constraintsKv = Object.entries(validationError.constraints!).map(([key, value]) => ({ key, value }));

          for (const item of constraintsKv) {
            errorList.push(item.value);
          }
        }

        return res.status(HttpStatus.BadRequest).send(new BadRequestError(errorList));
      } else {
        res.locals.input = output;
        // eslint-disable-next-line promise/no-callback-in-promise
        next();
      }
    });
  };
};
