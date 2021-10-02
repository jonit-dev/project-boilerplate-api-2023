import * as Amplitude from "@amplitude/node";
import Mixpanel from "mixpanel";

import { appEnv } from "../config/env";

export const mixpanel = Mixpanel.init(appEnv.analytics.mixpanelToken!, {
  protocol: "https",
});

export const amplitudeClient: Amplitude.NodeClient = Amplitude.init(appEnv.analytics.amplitudeApiKey!);
