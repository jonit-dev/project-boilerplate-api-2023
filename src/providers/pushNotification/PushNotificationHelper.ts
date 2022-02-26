import { User } from "@entities/ModuleSystem/UserModel";
import { EnvType } from "@rpg-engine/shared/dist";
import firebaseAdmin from "firebase-admin";
import { provide } from "inversify-binding-decorators";
import { appEnv } from "../config/env";
import { ENV_KEYS_PATH } from "../constants/PathConstants";

@provide(PushNotificationHelper)
export class PushNotificationHelper {
  public static firebaseAdmin: firebaseAdmin.app.App;

  // PS: I'm not initializing on the constructor because it causes a bug in firebase, since inversify leads to be it being triggered twice.
  public static initialize(): void {
    const serviceAccount = require(`${ENV_KEYS_PATH}/firebase-admin-keyfile.json`);

    PushNotificationHelper.firebaseAdmin = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: appEnv.database.FB_DB_PATH,
    });
  }

  public async sendMessage(
    userToken: string,
    title: string,
    body: string,
    data?: { [key: string]: string }
  ): Promise<void> {
    console.log("Sending push notification message...");

    if (appEnv.general.ENV === EnvType.Development) {
      console.log("🚫 Push notifications disabled on development mode.");
      return;
    }

    try {
      const payload = {
        title,
        body,
      };

      const response = await PushNotificationHelper.firebaseAdmin.messaging().send({
        notification: payload,
        data: {
          ...data,
          ...payload,
        },
        token: userToken,
      });
      if (response.includes("messages")) {
        console.log("Push submitted successfully.");
      } else {
        console.log(response);

        if (response.includes("Requested entity was not found.")) {
          const user = await User.findOne({ pushNotificationToken: userToken });

          // remove user push notification token

          if (user) {
            user.pushNotificationToken = undefined;
            await user.save();
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
