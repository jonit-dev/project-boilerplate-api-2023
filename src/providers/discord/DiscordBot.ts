import { appEnv } from "@providers/config/env";
import { DISCORD_CHANNEL_IDS, DiscordChannelName } from "@providers/constants/DiscordConstants";
import { EnvType } from "@rpg-engine/shared";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { provide } from "inversify-binding-decorators";

@provide(DiscordBot)
export class DiscordBot {
  private client: Client;
  private isReady: boolean = false;
  private readonly token: string;

  constructor() {
    this.token = appEnv.general.DISCORD_TOKEN!;
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });

    if (appEnv.general.ENV === EnvType.Development) {
      return;
    }

    this.initialize();
  }

  private initialize(): void {
    this.client.once("ready", () => {
      this.isReady = true;
    });

    this.client.login(this.token).catch((err) => {
      console.error("Failed to login:", err);
    });
  }

  public async sendMessage(message: string, channelName: DiscordChannelName): Promise<void> {
    try {
      if (!this.isReady) {
        return;
      }

      const channelId = DISCORD_CHANNEL_IDS[channelName];

      if (!channelId) {
        throw new Error(`Channel ID for ${channelName} not found`);
      }

      const channel = (await this.client.channels.fetch(channelId!)) as TextChannel;
      await channel.send(message);
    } catch (error) {
      console.error(`Failed to send message: ${error}`);
    }
  }
}
