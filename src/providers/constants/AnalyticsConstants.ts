import * as Amplitude from "@amplitude/node";
import Mixpanel from "mixpanel";

import { appEnv } from "../config/env";

export const mixpanel = Mixpanel.init(appEnv.analytics.mixpanelToken!, {
  protocol: "https",
});

export const amplitudeClient: Amplitude.NodeClient = Amplitude.init(appEnv.analytics.amplitudeApiKey!);

export const NEW_RELIC_ALLOWED_TRANSACTIONS: string[] = [
  // TODO: New Relic disabled for now. Use it only for sampling.
  // "getOtherELementsInView",
  // "getSkillLevelWithBuffs",
  // "getInventory",
  // "MoveTowards",
  // "NpcBattleCycle",
  // "NPCFreezer",
  // "NPCView.getElementsInNPCView",
  // "warncahracterAboutItemsInView",
  // "increaseShieldingSP",
  // "CharacterWeapon.getWeapon",
  // "Pathfinder/findShortestPath",
  // "HitTarget.hit",
  // "Operation/CharacterBattleCycle",
  // "NPCWarn.warnCharacterAboutNPCsInView",
  // "MovementHelper.isSolid",
  // "NPCCycle/Random",
  // "EntityEffectCycle.execute",
  // "BattleAttackTarget.checkRangeAndAttack",
  // "NPCCycle/MoveAway",
  // "SocketEvent/CharacterPositionUpdate",
];
