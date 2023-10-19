import { provide } from "inversify-binding-decorators";

@provide(TextAlphanumericChecker)
export class TextAlphanumericChecker {
  constructor() {}

  public isAlphanumeric(inputStr: string): boolean {
    const allowedChars = /^[A-Za-z0-9\s]+$/;
    return allowedChars.test(inputStr);
  }
}
