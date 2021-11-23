/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { JobPost } from "@entities/ModuleJob/JobPostModel";
import { EnvType, IJobPost } from "@project-remote-job-board/shared/dist";
import { appEnv } from "@providers/config/env";
import { STATIC_PATH } from "@providers/constants/PathConstants";
import { JobPostRepository } from "@repositories/ModuleJob/jobPost/JobPostRepository";
import axios from "axios";
import { provide } from "inversify-binding-decorators";
import { EnumChangefreq, simpleSitemapAndIndex } from "sitemap";

@provide(SitemapHelper)
export class SitemapHelper {
  constructor(private jobPostRepository: JobPostRepository) {}

  public async generateSitemap(): Promise<void> {
    const sitemapPath = `${STATIC_PATH}/sitemaps/posts`;

    // Fetch posts and create links data array
    const jobPosts: IJobPost[] = await this.jobPostRepository.readAll(JobPost, null);

    const links = jobPosts.map((jobPost) => {
      // set priority according to date diff

      let priority = 1;

      priority = 0.8; // setting all sitemap priority the same for now. If needed, just remove this and comment in the code below.

      return {
        url: `https://${appEnv.general.WEB_APP_URL}/posts/${jobPost.slug}`,
        changefreq: EnumChangefreq.DAILY,
        priority,
        lastmod: jobPost.updatedAt,
      };
    });

    simpleSitemapAndIndex({
      hostname: `https://${appEnv.general.API_SUBDOMAIN}/sitemaps/posts/`,
      destinationDir: sitemapPath,
      // @ts-ignore
      sourceData: links,
      limit: 25000,
      gzip: false,
    }).then(async () => {
      // loop through all generated sitemap files, and ping google about them!
      if (process.env.ENV === EnvType.Production) {
        // ping google to index our new sitemap files!
        await axios.get(
          `https://www.google.com/ping?sitemap=https://${appEnv.general.API_SUBDOMAIN}/sitemaps/posts/sitemap-index.xml`
        );
      }
    });
  }
}
