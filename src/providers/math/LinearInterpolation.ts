import { provide } from "inversify-binding-decorators";
import { round } from "lodash";

@provide(LinearInterpolation)
export class LinearInterpolation {
  public calculateLinearInterpolation(
    value: number,
    min: number,
    max: number,
    association: "default" | "reverse" = "default"
  ): number {
    if (association === "default") {
      // Linear interpolation formula for default skill association (higher skill, higher the value)
      value = min + ((max - min) * (value - 1)) / 99;
    } else {
      // Linear interpolation formula for reverse skill association (higher skill, lower the value)
      value = max - ((max - min) * (value - 1)) / 99;
    }

    return round(value);
  }
}
