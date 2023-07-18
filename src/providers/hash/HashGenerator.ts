import { createHash } from "crypto";
import { provide } from "inversify-binding-decorators";

@provide(HashGenerator)
export class HashGenerator {
  public generateHash(payload: any): string {
    const hash = createHash("sha256");
    hash.update(JSON.stringify(payload));
    return hash.digest("hex");
  }
}
