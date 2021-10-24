import { JobPost } from "@entities/ModuleJob/JobPostModel";
import { IScrapperURLCheck, ScrappedURLStatus } from "@project-remote-job-board/shared/dist";
import { provide } from "inversify-binding-decorators";

@provide(CheckUrlsScrappersUseCase)
export class CheckUrlsScrappersUseCase {
  public async checkUrls(urls: string[]): Promise<IScrapperURLCheck[]> {
    const output: IScrapperURLCheck[] = [];

    for (const url of urls) {
      const urlToCheck = url;

      const isUrlScrapped = await JobPost.exists({ sourceUrl: urlToCheck });

      output.push({
        url: urlToCheck,
        status: isUrlScrapped ? ScrappedURLStatus.Scrapped : ScrappedURLStatus.NotScrapped,
      });
    }

    return output;
  }
}
