import {
  BattleSocketEvents,
  ChatSocketEvents,
  ItemSocketEvents,
  SpellSocketEvents,
  ViewSocketEvents,
} from "@rpg-engine/shared";

import os from "os";

export const USER_CONTROL_ONLINE = {
  MAX_NUMBER_OF_PLAYERS: 30,
  MAX_NUMBER_ACC_PER_USER: 20,
};

export const USER_EXHAUST_TIMEOUT = 1500;

export const EXHAUSTABLE_EVENTS = [
  ChatSocketEvents.GlobalChatMessageCreate,
  ChatSocketEvents.GlobalChatMessageRead,
  ItemSocketEvents.UseWith,
  "CastSpell",
  "UseWithTile",
  "UseWithItem",
  ItemSocketEvents.Use,
  ItemSocketEvents.CraftItem,
] as string[];

export const LOGGABLE_EVENTS = [
  ItemSocketEvents.Use,
  ItemSocketEvents.UseWith,
  ItemSocketEvents.CraftItem,
  "CastSpell",
];

export const LOCKABLE_EVENTS = [
  ItemSocketEvents.Pickup,
  ItemSocketEvents.Equip,
  ItemSocketEvents.Unequip,
  ItemSocketEvents.Drop,
  ItemSocketEvents.Use,
  ItemSocketEvents.UseWith,
  ItemSocketEvents.ContainerTransfer,
  ItemSocketEvents.CraftItem,
  ItemSocketEvents.Move,
  "UseWithTile",
  "UseWithItem",
  BattleSocketEvents.InitTargeting,
  BattleSocketEvents.StopTargeting,
  ItemSocketEvents.LoadCraftBook,
  ItemSocketEvents.CraftItem,
  ChatSocketEvents.GlobalChatMessageCreate,
  ViewSocketEvents.Destroy,
] as string[];

export const THROTTABLE_EVENTS_MS_THRESHOLD_DISCONNECT = 70;

export const THROTTABLE_DEFAULT_MS_THRESHOLD = 1000;

export const THROTTABLE_EVENTS = {
  [ItemSocketEvents.LoadCraftBook]: 500,
  [ItemSocketEvents.CraftItem]: 2000,
  [ChatSocketEvents.GlobalChatMessageCreate]: THROTTABLE_DEFAULT_MS_THRESHOLD,
  [SpellSocketEvents.CastSpell]: THROTTABLE_DEFAULT_MS_THRESHOLD,
};

export const PROMISE_DEFAULT_CONCURRENCY = os.cpus().length || 2;

export const MAX_PING_TRACKING_THRESHOLD = 10000;
