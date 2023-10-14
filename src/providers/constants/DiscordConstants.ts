export const DISCORD_CHANNEL_IDS = {
  "pvp-and-wars": "1146449423304499273",
  raids: "1146299331243147314",
  trade: "1080731826915643492",
  bans: "1087945359378100274",
  marketplaceBotNotifications: "1147031074308882453",
  achievements: "1147358878409969746",
  rankings: "1162809636341153904",
};

export type DiscordChannelName = keyof typeof DISCORD_CHANNEL_IDS;
