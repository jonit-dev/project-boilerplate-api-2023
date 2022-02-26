import { TranslationTypes } from "@rpg-engine/shared";
import _ from "lodash";
import { appEnv } from "../config/env";
import { ROOT_PATH } from "../constants/PathConstants";

interface IInterpolationObjs {
  [key: string]: string;
}

export class TS {
  public static translate(
    context: TranslationTypes,
    key: string,
    interpolationObjs?: IInterpolationObjs,
    capitalizeObjKeys: boolean = true
  ): string {
    const envLang = appEnv.general.LANGUAGE!;

    const jsonFile = require(`${ROOT_PATH}node_modules/@rpg-engine/shared/dist/translations/${context}.lang.json`);

    let translatedString: string;

    try {
      translatedString = jsonFile[key][envLang];
    } catch (error) {
      translatedString = `TRANSLATION_KEY_NOT_FOUND_FOR_${context}_${key}`;
    }

    if (interpolationObjs) {
      for (const key of Object.keys(interpolationObjs)) {
        translatedString = translatedString.replace(
          `{{${key}}}`,
          capitalizeObjKeys ? _.capitalize(interpolationObjs[key]) : interpolationObjs[key]
        );
      }
    }

    return translatedString;
  }
}
