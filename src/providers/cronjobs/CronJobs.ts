import { EnvType } from "@project-remote-job-board/shared/dist";
import { appEnv } from "@providers/config/env";
import { SitemapHelper } from "@providers/SEO/SitemapHelper";
import { provide } from "inversify-binding-decorators";

@provide(Cronjob)
class Cronjob {
  constructor(private sitemapHelper: SitemapHelper) {}

  public start(): void {
    this.scheduleCrons();
  }

  private scheduleCrons(): void {
    console.log("🕒 Start cronjob scheduling...");

    if (appEnv.general.ENV === EnvType.Production) {
      switch (process.env.pm_id) {
        case "0":
          this.sitemapHelper.scheduleSitemapCron();
          break;
        case "1":
          break;
        case "2":
          break;
        case "3":
          break;
      }
    }
  }
}

export { Cronjob };
