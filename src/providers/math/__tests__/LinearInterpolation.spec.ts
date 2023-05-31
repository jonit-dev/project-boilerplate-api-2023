import { container } from "@providers/inversify/container";
import { LinearInterpolation } from "../LinearInterpolation";

describe("LinearInterpolation", () => {
  let linearInterpolation: LinearInterpolation;

  beforeAll(() => {
    linearInterpolation = container.get(LinearInterpolation);
  });

  it("Should correctly calculate default linear interpolation", () => {
    const result = linearInterpolation.calculateLinearInterpolation(50, 1, 100);
    expect(result).toBeCloseTo(50); // Adjust to your expected value
  });

  it("Should correctly calculate reverse linear interpolation", () => {
    const result = linearInterpolation.calculateLinearInterpolation(50, 1, 100, "reverse");
    expect(result).toBeCloseTo(51); // Adjusted to the expected value
  });

  it("Should handle edge case of minimum value", () => {
    const result = linearInterpolation.calculateLinearInterpolation(1, 1, 100);
    expect(result).toBeCloseTo(1); // Adjust to your expected value
  });

  it("Should handle edge case of maximum value", () => {
    const result = linearInterpolation.calculateLinearInterpolation(99, 1, 100);
    expect(result).toBeCloseTo(99); // Adjusted to the expected value
  });
});
