import { provide } from "inversify-binding-decorators";
import randomstring from "randomstring";
import getSlug from "speakingurl";

@provide(JobPostHelper)
export class JobPostHelper {
  public generateSlug(title: string): string {
    const randomString = randomstring.generate({
      length: 5,
      charset: "alphabetic",
    });

    return getSlug(`${title}-${randomString}`);
  }
}
