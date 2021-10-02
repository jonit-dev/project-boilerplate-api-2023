import _ from "lodash";

export class TextHelper {
  public static capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private static escapeRegExp(str): string {
    return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
  }

  public static replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(TextHelper.escapeRegExp(find), "g"), replace);
  }

  public static stringPrepare(str: string): string {
    return str.toLowerCase().trim();
  }

  public static getFileExtension(path: string): string {
    return path.slice((Math.max(0, path.lastIndexOf(".")) || Infinity) + 1);
  }

  public static parsePercentage(number: string): String | undefined {
    return number.match("[+-]?(?:[0-9]*[.])?[0-9]+")?.join("");
  }

  public static parseSuffix(number: string): Number {
    const suffix = number[number.length - 1];

    let fmtNumber = 0;

    switch (suffix) {
      case "B":
        fmtNumber = Number(TextHelper.parsePercentage(number)) * Math.pow(10, 9);
        break;
      case "M":
        fmtNumber = Number(TextHelper.parsePercentage(number)) * Math.pow(10, 6);
        break;
      default:
        fmtNumber = -1;
        break;
    }

    return fmtNumber;
  }

  public static applyFunctionToObjValues(object: Record<any, any>, func: Function): any {
    return _.transform(object, function (result: any, value, key) {
      switch (typeof value) {
        case "string":
          result[key] = func(value);
          break;
        case "object":
          const mappedObj = _.transform(value, function (result: any, value, key) {
            result[key] = func(value);
          });

          result[key] = mappedObj;

          break;
        default:
          result[key] = value;
          break;
      }
    });
  }
}
