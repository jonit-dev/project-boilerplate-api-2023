import * as Amplitude from "@amplitude/node";
import Mixpanel from "mixpanel";

import { appEnv } from "../config/env";

export const mixpanel = Mixpanel.init(appEnv.analytics.mixpanelToken!, {
  protocol: "https",
});

export const amplitudeClient: Amplitude.NodeClient = Amplitude.init(appEnv.analytics.amplitudeApiKey!);

export const NEW_RELIC_SAMPLE_RATE = 0.01; // 5% of transactions will be sampled

//! Disabled for now. Use it together with NewRelic.ts to filter events
export const NEW_RELIC_ALLOWED_TRANSACTIONS: string[] = [
  "getOtherELementsInView",
  "getSkillLevelWithBuffs",
  "getInventory",
  "MoveTowards",
  "NpcBattleCycle",
  "NPCFreezer",
  "NPCView.getElementsInNPCView",
  "warnCharacterAboutItemsInView",
  "increaseShieldingSP",
  "CharacterWeapon.getWeapon",
  "findShortestPath",
  "HitTarget.hit",
  "CharacterBattleCycle",
  "NPCWarn.warnCharacterAboutNPCsInView",
  "MovementHelper.isSolid",
  "Random",
  "EntityEffectCycle.execute",
  "BattleAttackTarget.checkRangeAndAttack",
  "MoveAway",
  "SocketEvent/CharacterPositionUpdate",
];
