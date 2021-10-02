import { provide } from "inversify-binding-decorators";

@provide(UserHelper)
export class UserHelper {
  public getFirstName(name: string): string {
    return name.split(" ")[0] || name;
  }
}
