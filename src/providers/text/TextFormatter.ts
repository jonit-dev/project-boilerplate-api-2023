import { provide } from "inversify-binding-decorators";

@provide(TextFormatter)
export class TextFormatter {
  public convertCamelCaseToSentence(input: string): string {
    const output = input.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
    return output;
  }
}
