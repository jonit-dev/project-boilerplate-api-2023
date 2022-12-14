/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { container } from "@providers/inversify/container";
import { MathHelper } from "../MathHelper";

describe("MathHelper.ts", () => {
  let mathHelper: MathHelper;

  beforeAll(() => {
    mathHelper = container.get<MathHelper>(MathHelper);
  });

  describe("addMultiplier", () => {
    it("addMultiplier returns the correct value when the input string has a 'B' suffix", () => {
      expect(mathHelper.addMultiplier("1B")).toBe(1000000000);
      expect(mathHelper.addMultiplier("2.5B")).toBe(2500000000);
      expect(mathHelper.addMultiplier("0.1B")).toBe(100000000);
    });

    it("addMultiplier returns the correct value when the input string has an 'M' suffix", () => {
      expect(mathHelper.addMultiplier("1M")).toBe(1000000);
      expect(mathHelper.addMultiplier("2.5M")).toBe(2500000);
      expect(mathHelper.addMultiplier("0.1M")).toBe(100000);
    });

    it("addMultiplier returns the correct value when the input string has a 'K' suffix", () => {
      expect(mathHelper.addMultiplier("1K")).toBe(1000);
      expect(mathHelper.addMultiplier("2.5K")).toBe(2500);
      expect(mathHelper.addMultiplier("0.1K")).toBe(100);
    });

    it("addMultiplier returns the correct value when the input string does not have a suffix", () => {
      expect(mathHelper.addMultiplier("1")).toBe(1);
      expect(mathHelper.addMultiplier("2.5")).toBe(2.5);
      expect(mathHelper.addMultiplier("0.1")).toBe(0.1);
    });
  });

  describe("Median and weighted median", () => {
    it("median returns the correct value for odd-length arrays", () => {
      expect(mathHelper.median([1, 2, 3, 4, 5])).toBe(3);
      expect(mathHelper.median([5, 4, 3, 2, 1])).toBe(3);
      expect(mathHelper.median([1, 5, 3, 2, 4])).toBe(3);
    });

    it("median returns the correct value for even-length arrays", () => {
      expect(mathHelper.median([1, 2, 3, 4])).toBe(2.5);
      expect(mathHelper.median([4, 3, 2, 1])).toBe(2.5);
      expect(mathHelper.median([1, 4, 2, 3])).toBe(2.5);
    });

    it("weightedMean returns the correct value for arrays with the same length", () => {
      expect(mathHelper.weightedMean([1, 2, 3, 4], [1, 1, 1, 1])).toBe(2.5);
      expect(mathHelper.weightedMean([4, 3, 2, 1], [1, 1, 1, 1])).toBe(2.5);
      expect(mathHelper.weightedMean([1, 4, 2, 3], [1, 1, 1, 1])).toBe(2.5);
    });
  });

  describe("distance", () => {
    it("should calculate the right distance between 2 X and Y points", () => {
      const distance = mathHelper.getDistanceBetweenPoints(0, 0, 100, 0);

      expect(distance).toBe(100);
    });

    it("should calculate the proper distance, even when coordinates are negative number", () => {
      const distance = mathHelper.getDistanceBetweenPoints(-50, -30, 50, 27);

      expect(Math.floor(distance)).toBe(115);
    });

    it("should calculate the proper direction between 2 points", () => {
      let direction = mathHelper.getDirectionFromPoint({ x: 0, y: 0 }, { x: 0, y: 16 });
      expect(direction).toBe("down");
      direction = mathHelper.getDirectionFromPoint({ x: 0, y: 16 }, { x: 0, y: 0 });
      expect(direction).toBe("up");
      direction = mathHelper.getDirectionFromPoint({ x: 0, y: 0 }, { x: 16, y: 0 });
      expect(direction).toBe("right");
      direction = mathHelper.getDirectionFromPoint({ x: 16, y: 0 }, { x: 0, y: 0 });
      expect(direction).toBe("left");
      direction = mathHelper.getDirectionFromPoint({ x: 0, y: 0 }, { x: 16, y: 16 });
      expect(direction).toBe("down_right");
      direction = mathHelper.getDirectionFromPoint({ x: 16, y: 0 }, { x: 0, y: 16 });
      expect(direction).toBe("down_left");
      direction = mathHelper.getDirectionFromPoint({ x: 0, y: 16 }, { x: 16, y: 0 });
      expect(direction).toBe("up_right");
      direction = mathHelper.getDirectionFromPoint({ x: 16, y: 16 }, { x: 0, y: 0 });
      expect(direction).toBe("up_left");
    });
  });

  describe("isXYInsideRectangle", () => {
    it("returns true if the point is inside the rectangle", () => {
      const point = { x: 10, y: 20 };
      const rect = { left: 5, right: 15, top: 15, bottom: 25 };
      expect(mathHelper.isXYInsideRectangle(point, rect)).toBe(true);
    });

    it("returns false if the point is outside the rectangle", () => {
      const point = { x: 10, y: 20 };
      const rect = { left: 15, right: 25, top: 15, bottom: 25 };
      expect(mathHelper.isXYInsideRectangle(point, rect)).toBe(false);
    });

    it("returns false if the point is on the left edge of the rectangle", () => {
      const point = { x: 5, y: 20 };
      const rect = { left: 5, right: 15, top: 15, bottom: 25 };
      expect(mathHelper.isXYInsideRectangle(point, rect)).toBe(false);
    });

    it("returns false if the point is on the right edge of the rectangle", () => {
      const point = { x: 15, y: 20 };
      const rect = { left: 5, right: 15, top: 15, bottom: 25 };
      expect(mathHelper.isXYInsideRectangle(point, rect)).toBe(false);
    });
  });

  describe("Crossed grid points", () => {
    it("should get an array of the crossed grid points by a line between 2 points", () => {
      const expectedResults = {
        diagonalLine: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 3, y: 3 },
          { x: 4, y: 4 },
          { x: 5, y: 5 },
        ],
        horizontalLine: [
          { x: 0, y: 5 },
          { x: 0, y: 4 },
          { x: 0, y: 3 },
          { x: 0, y: 2 },
          { x: 0, y: 1 },
          { x: 0, y: 0 },
        ],
      };
      const crossedGridPointsDiagonalLine = mathHelper.getCrossedGridPoints({ x: 0, y: 0 }, { x: 5, y: 5 });
      expect(crossedGridPointsDiagonalLine).toEqual(expectedResults.diagonalLine);
      const crossedGridPointsHorizontalLine = mathHelper.getCrossedGridPoints({ x: 0, y: 5 }, { x: 0, y: 0 });
      expect(crossedGridPointsHorizontalLine).toEqual(expectedResults.horizontalLine);
    });

    it("should get an array of the circundating grid points", () => {
      const deltaOne = 1;
      const deltaTwo = 2;
      const expectedResults = {
        deltaOne: [
          { x: 0, y: 2 },
          { x: 0, y: 1 },
          { x: 0, y: 0 },
          { x: 1, y: 2 },
          { x: 1, y: 0 },
          { x: 2, y: 2 },
          { x: 2, y: 1 },
          { x: 2, y: 0 },
        ],
        noNegatives: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
        ],
        deltaTwo: [
          { x: 0, y: 4 },
          { x: 0, y: 3 },
          { x: 0, y: 2 },
          { x: 0, y: 1 },
          { x: 0, y: 0 },
          { x: 1, y: 4 },
          { x: 1, y: 3 },
          { x: 1, y: 2 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
          { x: 2, y: 4 },
          { x: 2, y: 3 },
          { x: 2, y: 1 },
          { x: 2, y: 0 },
          { x: 3, y: 4 },
          { x: 3, y: 3 },
          { x: 3, y: 2 },
          { x: 3, y: 1 },
          { x: 3, y: 0 },
          { x: 4, y: 4 },
          { x: 4, y: 3 },
          { x: 4, y: 2 },
          { x: 4, y: 1 },
          { x: 4, y: 0 },
        ],
      };
      const circundatingPoints = mathHelper.getCircundatingGridPoints({ x: 1, y: 1 }, deltaOne);
      expect(circundatingPoints).toEqual(expectedResults.deltaOne);
      const noNegativePoints = mathHelper.getCircundatingGridPoints({ x: 0, y: 0 }, deltaOne);
      expect(noNegativePoints).toEqual(expectedResults.noNegatives);
      const circundatingPoints2 = mathHelper.getCircundatingGridPoints({ x: 2, y: 2 }, deltaTwo);
      expect(circundatingPoints2).toEqual(expectedResults.deltaTwo);
    });
  });
});
