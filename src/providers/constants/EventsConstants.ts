import { CharacterSocketEvents, NPCSocketEvents, ViewSocketEvents } from "@rpg-engine/shared";

export const BYPASS_EVENTS_AS_LAST_ACTION = [
  CharacterSocketEvents.CharacterPing,
  ViewSocketEvents.Destroy,
  NPCSocketEvents.NPCPositionRequest,
];
