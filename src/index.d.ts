/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
declare module "mongoose" {
  interface Document {
    lockField(fieldName: string): Promise<void>;
    unlockField(fieldName: string): Promise<void>;
  }
}
