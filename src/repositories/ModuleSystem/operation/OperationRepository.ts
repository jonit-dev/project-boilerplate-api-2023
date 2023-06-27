import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { FullCRUD } from "@providers/mongoDB/FullCRUD";
import { provide } from "inversify-binding-decorators";

import { IOperation } from "./IOperation";

@provide(OperationRepository)
export class OperationRepository extends FullCRUD implements IOperation {
  constructor(private analyticsHelper: AnalyticsHelper) {
    super(analyticsHelper);
  }
}
