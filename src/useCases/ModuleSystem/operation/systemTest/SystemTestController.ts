import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { isAdminMiddleware } from "@providers/middlewares/IsAdminMiddleware";
import { SitemapHelper } from "@providers/SEO/SitemapHelper";
import { controller, httpGet, interfaces } from "inversify-express-utils";

@controller("/operations", AuthMiddleware, isAdminMiddleware)
export class SystemTestController implements interfaces.Controller {
  constructor(private sitemapHelper: SitemapHelper) {}

  @httpGet("/test/sitemap")
  public async testSitemap(): Promise<void> {
    return await this.sitemapHelper.generateSitemap();
  }
}
