import { appEnv } from "@providers/config/env";
import { DISCORD_CHANNEL_IDS, DiscordChannelName } from "@providers/constants/DiscordConstants";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { EnvType } from "@rpg-engine/shared";
import { Client, ColorResolvable, Colors, EmbedBuilder, GatewayIntentBits, TextChannel } from "discord.js";

const emojisMessages = ["✨", "⭐", "🌀", "🌌", "🚀", "🤟", "🤙", "💪🏻", "💪🏽"];

const lvlUpMessages = [
  "Behold! {name} has reached level {level} in {skillName}! A new legend is born! {emoji}",
  "Bravo, {name}! Level {level} in {skillName} looks good on you. {emoji}",
  "Level up! {name} is now level {level} in {skillName}. Keep climbing! {emoji}",
  "Epic! {name} has ascended to level {level} in {skillName}. {emoji}",
  "Congratulations, {name}! You've powered up to level {level} in {skillName}. {emoji}",
  "Huzzah! {name} has advanced to level {level} in {skillName}. {emoji}",
  "Witness the power of {name}! Now at level {level} in {skillName}. {emoji}",
  "Well done, {name}! You've leveled up to {level} in {skillName}. {emoji}",
  "Amazing! {name} has conquered level {level} in {skillName}. {emoji}",
  "Kudos to {name} for achieving level {level} in {skillName}! {emoji}",
  "Look out world, {name} just hit level {level} in {skillName}. {emoji}",
  "Majestic! {name} has evolved to level {level} in {skillName}. {emoji}",
  "A round of applause for {name}! Now at level {level} in {skillName}. {emoji}",
  "Onward and upward! {name} is now level {level} in {skillName}. {emoji}",
  "Fantastic! {name} has reached the mighty level {level} in {skillName}. {emoji}",
  "Unstoppable! {name} has soared to level {level} in {skillName}. {emoji}",
  "Cheers to {name} for breaking through to level {level} in {skillName}! {emoji}",
  "All hail {name}, now at the awe-inspiring level {level} in {skillName}! {emoji}",
  "A new milestone! {name} is celebrating level {level} in {skillName}. {emoji}",
  "Tremendous! {name} has scaled the peak of level {level} in {skillName}. {emoji}",
];

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

      if (!appEnv.general.DISCORD_TOKEN!) {
        console.log("🤖 Failed to initialize Discord bot. DISCORD_TOKEN is not set.");
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

  public async sendMessageWithColor(
    message: string,
    channelName: DiscordChannelName,
    title?: string,
    color?: ColorResolvable
  ): Promise<void> {
    const embed = new EmbedBuilder()
      .setTitle(title || "")
      .setColor(color ?? Colors.Orange)
      .setAuthor({
        name: "Definya Bot",
        iconURL: "https://i.imgur.com/VVy83d8.png",
        url: "https://play.definya.com/",
      })
      .setDescription(message);

    const channelId = DISCORD_CHANNEL_IDS[channelName];

    if (!channelId) {
      throw new Error(`Channel ID for ${channelName} not found`);
    }

    const channel = (await this.client.channels.fetch(channelId)) as TextChannel;
    await channel.send({ embeds: [embed] });
  }

  public getRandomLevelUpMessage(characterName: string, skillLevel: number, skillName: string): string {
    const randomIndex = Math.floor(Math.random() * lvlUpMessages.length);
    const randomMessageTemplate = lvlUpMessages[randomIndex];

    let formattedSkillName = skillName.charAt(0).toUpperCase() + skillName.slice(1);

    if (skillName === "magicResistance") {
      formattedSkillName = "Magic Resistance";
    }

    const randomEmoji = this.getRandomEmoji();

    return randomMessageTemplate
      .replace("{name}", characterName.toUpperCase())
      .replace("{level}", skillLevel.toString())
      .replace("{skillName}", formattedSkillName)
      .replace("{emoji}", randomEmoji);
  }

  private getRandomEmoji(): string {
    const randomIndex = Math.floor(Math.random() * emojisMessages.length);
    return emojisMessages[randomIndex];
  }
}
