import { controller, httpGet, request, response } from "inversify-express-utils";
import { Request, Response } from "express";

@controller("/ping")
export class PingController {
  constructor() {}

  @httpGet("/:server")
  public pingServer(@request() req: Request, @response() res: Response): void {
    res.status(200).send();
  }
}
