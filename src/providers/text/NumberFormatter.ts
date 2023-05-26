import { provide } from "inversify-binding-decorators";

@provide(NumberFormatter)
export class NumberFormatter {
  public formatNumber(number: number): number {
    return Number(Number.isInteger(number) ? number.toString() : number.toFixed(2));
  }
}
