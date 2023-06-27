import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { FullCRUD } from "@providers/mongoDB/FullCRUD";
import { provide } from "inversify-binding-decorators";

@provide(NPCRepository)
export class NPCRepository extends FullCRUD {
  constructor(private analyticsHelper: AnalyticsHelper) {
    super(analyticsHelper);
  }
}
