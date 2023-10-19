import * as Amplitude from "@amplitude/node";
import Mixpanel from "mixpanel";

import { appEnv } from "../config/env";

export const mixpanel = Mixpanel.init(appEnv.analytics.mixpanelToken!, {
  protocol: "https",
});

export const amplitudeClient: Amplitude.NodeClient = Amplitude.init(appEnv.analytics.amplitudeApiKey!);

export const NEW_RELIC_SAMPLE_RATE = 0.1; // 10% of transactions will be sampled
