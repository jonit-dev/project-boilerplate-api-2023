import { ItemSocketEvents } from "@rpg-engine/shared";

import os from "os";

export const USER_EXHAUST_TIMEOUT = 1500;

export const LOGGABLE_EVENTS = [
  ItemSocketEvents.Use,
  ItemSocketEvents.UseWith,
  ItemSocketEvents.CraftItem,
  "CastSpell",
];

export const PROMISE_DEFAULT_CONCURRENCY = os.cpus().length || 2;
