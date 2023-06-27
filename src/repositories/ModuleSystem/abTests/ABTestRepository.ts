import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { FullCRUD } from "@providers/mongoDB/FullCRUD";
import { provide } from "inversify-binding-decorators";

@provide(ABTestRepository)
export class ABTestRepository extends FullCRUD {
  constructor(private analyticsHelper: AnalyticsHelper) {
    super(analyticsHelper);
  }
}
