import { EnvType } from "@project-remote-job-board/shared/dist";
import { provide } from "inversify-binding-decorators";

import { IUser } from "../../entities/ModuleSystem/UserModel";
import { appEnv } from "../config/env";
import { mixpanel } from "../constants/AnalyticsConstants";

@provide(MixpanelTracker)
export class MixpanelTracker {
  public track(eventName: string, user?: IUser): void {
    try {
      if (appEnv.general.ENV === EnvType.Development) {
        console.log(
          `✨ Mixpanel: Tracking event ${eventName} ${user ? `for user ${user.email}` : ""} (disabled in development)`
        );

        return;
      }

      console.log(`✨ Mixpanel: Tracking event ${eventName} ${user ? `for user ${user.email}` : ""}`);
      let properties;
      if (user) {
        properties = { distinct_id: user._id, time: new Date() };
      } else {
        properties = { time: new Date() };
      }

      mixpanel.track(eventName, properties, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  public updateUserInfo(user: IUser): void {
    try {
      if (appEnv.general.ENV === EnvType.Development) {
        return;
      }

      console.log(`✨ Mixpanel: People set > Updating user info for user ${user.email}`);

      if (user) {
        mixpanel.people.set(
          user.id,
          {
            $first_name: user.name,
            $created: user.createdAt,
            $region: user.address,
            plan: user.role,
            $email: user.email,
            address: user.address,
            phone: user.phone,
          },
          {
            $ip: "127.0.0.1",
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
