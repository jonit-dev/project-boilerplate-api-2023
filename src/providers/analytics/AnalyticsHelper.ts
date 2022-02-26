import { Identify } from "@amplitude/identify";
import { DEFAULT_DATE_FORMAT } from "@providers/constants/DateConstants";
import { EnvType } from "@rpg-engine/shared/dist";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import { IUser } from "../../entities/ModuleSystem/UserModel";
import { appEnv } from "../config/env";
import { amplitudeClient, mixpanel } from "../constants/AnalyticsConstants";

@provide(AnalyticsHelper)
export class AnalyticsHelper {
  constructor() {}

  public track(eventName: string, user?: IUser): void {
    try {
      if (appEnv.general.ENV === EnvType.Development) {
        console.log(
          `✨ Analytics: Tracking event ${eventName} ${user ? `for user ${user.email}` : ""} (disabled in development)`
        );
        return;
      }

      console.log(`✨ Analytics: Tracking event ${eventName} ${user ? `for user ${user.email}` : ""}`);

      amplitudeClient.logEvent({
        event_type: eventName,
        user_id: user?.email,
        ip: "127.0.0.1",
        event_properties: {
          time: new Date(),
        },
      });
      amplitudeClient.flush();

      let mixpanelProperties;
      if (user) {
        mixpanelProperties = { distinct_id: user._id, time: new Date() };
      } else {
        mixpanelProperties = { time: new Date() };
      }

      mixpanel.track(eventName, mixpanelProperties, (err) => {
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

      console.log(`✨ Analytics: People set > Updating user info for user ${user.email}`);

      if (user) {
        // amplitude user
        const identify = new Identify();
        identify.set("start_date", dayjs(new Date()).format(DEFAULT_DATE_FORMAT));

        amplitudeClient.identify(user._id, user._id, identify);

        // mixpanel user
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
