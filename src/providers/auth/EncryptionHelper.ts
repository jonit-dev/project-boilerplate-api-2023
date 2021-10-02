import Cryptr from "cryptr";
import { provide } from "inversify-binding-decorators";

import { appEnv } from "../config/env";

@provide(EncryptionHelper)
export class EncryptionHelper {
  public cryptr: Cryptr;

  constructor() {
    this.cryptr = new Cryptr(appEnv.encryption.genericHash);
  }

  public encrypt(text: string): string {
    return this.cryptr.encrypt(text);
  }

  public decrypt(hash): string {
    return this.cryptr.decrypt(hash);
  }
}
