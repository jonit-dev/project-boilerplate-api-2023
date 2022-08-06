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
});

// your code here
