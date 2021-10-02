import fs from "fs";

import { ROOT_PATH } from "../constants/PathConstants";

export class TemplateHelper {
  // Returns template html content as a string
  public static loadTemplate(name: string): string {
    return fs.readFileSync(`${ROOT_PATH}/templates/${name}.html`, {
      encoding: "utf-8",
    });
  }
}
