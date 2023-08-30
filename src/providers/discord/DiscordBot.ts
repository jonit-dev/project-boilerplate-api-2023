import { appEnv } from "@providers/config/env";
import { DISCORD_CHANNEL_IDS, DiscordChannelName } from "@providers/constants/DiscordConstants";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { EnvType } from "@rpg-engine/shared";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";

@provideSingleton(DiscordBot)
export class DiscordBot {
  private client: Client;
  private isReady: boolean = false;
  private token: string;

  public initialize(): void {
    try {
      if (appEnv.general.ENV === EnvType.Development) {
        return;
      }

      console.log("🤖 Initializing Discord bot...");

      if (this.token && this.client) {
        return;
      }

      this.token = appEnv.general.DISCORD_TOKEN!;
      this.client = new Client({
        intents: [GatewayIntentBits.Guilds],
      });

      this.client.once("ready", () => {
        console.log(`Logged in as ${this.client.user?.tag}!`);
        this.isReady = true;
      });

      this.client.login(this.token).catch((err) => {
        console.error("Failed to login:", err);
      });
    } catch (error) {
      console.error(error);
    }
  }

  public async sendMessage(message: string, channelName: DiscordChannelName): Promise<void> {
    try {
      console.log("🤖 Discord bot - Sending message: ", message, `Channel: ${channelName}`);

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
