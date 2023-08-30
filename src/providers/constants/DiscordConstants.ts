export const DISCORD_CHANNEL_IDS = {
  "pvp-and-wars": "1063552162459820073",
  raids: "1146299331243147314",
  trade: "1080731826915643492",
  bans: "1087945359378100274",
  "level-up": "1146302899253678141",
};

export type DiscordChannelName = keyof typeof DISCORD_CHANNEL_IDS;
