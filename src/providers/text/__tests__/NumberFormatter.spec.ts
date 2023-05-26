import { container } from "@providers/inversify/container";
import { NumberFormatter } from "../NumberFormatter";

describe("NumberFormatter", () => {
  let numberFormatter;
  beforeAll(() => {
    numberFormatter = container.get(NumberFormatter);
  });

  it("should return an integer, if a integer is passed", () => {
    const result = numberFormatter.formatNumber(1);

    expect(result).toEqual(1);
  });

  it("should return a fractional number with 2 digits, if a float is passed", () => {
    const result = numberFormatter.formatNumber(1.2132);

    expect(result).toEqual(1.21);
  });
});
