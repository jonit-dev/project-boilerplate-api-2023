import { fluentProvide } from "inversify-binding-decorators";

export const provideSingleton = (identifier: any): any => {
  return fluentProvide(identifier).inSingletonScope().done();
};
