/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container } from "@providers/inversify/container";
import { MathHelper } from "../MathHelper";

describe("MathHelper.ts", () => {
  let mathHelper: MathHelper;

  beforeAll(() => {
    mathHelper = container.get<MathHelper>(MathHelper);
  });

  it("should calculate the right distance between 2 X and Y points", () => {
    const distance = mathHelper.getDistanceBetweenPoints(0, 0, 100, 0);

    expect(distance).toBe(100);
  });

  it("should calculate the proper distance, even when coordinates are negative number", () => {
    const distance = mathHelper.getDistanceBetweenPoints(-50, -30, 50, 27);

    expect(Math.floor(distance)).toBe(115);
  });
});

// your code here
