import { provide } from "inversify-binding-decorators";

@provide(Cronjob)
class Cronjob {
  constructor() {}

  public start(): void {
    this.scheduleCrons();
  }

  private scheduleCrons(): void {
    console.log("🕒 Start cronjob scheduling...");

    switch (process.env.pm_id) {
      case "0":
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

export { Cronjob };
