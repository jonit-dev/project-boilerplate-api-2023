import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { CRUD } from "@providers/mongoDB/MongoCRUDGeneric";
import { provide } from "inversify-binding-decorators";

import { IOperation } from "./IOperation";

@provide(OperationRepository)
export class OperationRepository extends CRUD implements IOperation {
  constructor(private analyticsHelper: AnalyticsHelper) {
    super(analyticsHelper);
  }
}
