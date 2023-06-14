/* eslint-disable require-await */
/* eslint-disable no-async-promise-executor */
import { provide } from "inversify-binding-decorators";
import mongoose from "mongoose";

@provide(TransactionManager)
export class TransactionManager {
  public async performSafeTransaction<T>(callback: (session: mongoose.ClientSession) => Promise<T>): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // pass session to callback and await it
        const callbackResult = await callback(session);
        await session.commitTransaction(); // commit before ending session
        session.endSession();
        resolve(callbackResult);
      } catch (error) {
        console.log("Transaction failed with: ", error);
        await session.abortTransaction();
        session.endSession(); // end session after aborting
        reject(error);
      }
    });
  }
}
