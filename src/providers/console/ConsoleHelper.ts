import chalk from "chalk";
import { provide } from "inversify-binding-decorators";

@provide(ConsoleHelper)
export class ConsoleHelper {
  constructor() {}

  public coloredLog(text: string, template: "YELLOW" | "RED" | "BLUE" | "GREEN" = "YELLOW"): string | void {
    switch (template) {
      case "YELLOW":
        console.log(chalk.bgYellow.black(text));
        break;
      case "RED":
        console.log(chalk.bgRed.black(text));
        break;
      case "BLUE":
        console.log(chalk.bgBlue.black(text));
        break;
      case "GREEN":
        console.log(chalk.bgGreen.black(text));
    }
  }
}
