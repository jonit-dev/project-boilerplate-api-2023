import { Request, Response } from "express";
import fs from "fs";
import { controller, httpGet, interfaces, queryParam } from "inversify-express-utils";

import { EncryptionHelper } from "../../../../providers/auth/EncryptionHelper";
import { STATIC_PATH } from "../../../../providers/constants/PathConstants";
import { TS } from "@providers/translation/TranslationHelper";
import { UnsubscribeUserUseCase } from "./UnsubscribeUserUseCase";

@controller("/users")
export class UnsubscribeUsercontroller implements interfaces.Controller {
  constructor(private userService: UnsubscribeUserUseCase, private encryptionHelper: EncryptionHelper) {}

  @httpGet("/unsubscribe")
  private async unsubscribeUser(
    @queryParam("hashEmail") hashEmail: string,
    req: Request,
    res: Response
  ): Promise<string | Response<any>> {
    if (!hashEmail) {
      return res.status(500).send({
        status: "error",
        message: TS.translate("error", "noHashEmail"),
      });
    }
    const email = this.encryptionHelper.decrypt(String(hashEmail));

    try {
      // lets try unsubscribing this user
      await this.userService.unsubscribeUser(email);

      // I decided for readFileSync because sendFile does not work with inversify-js: https://github.com/inversify/InversifyJS/issues/1045
      const html = fs.readFileSync(`${STATIC_PATH}/unsubscribe.html`, "utf8");

      return res.send(html);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
