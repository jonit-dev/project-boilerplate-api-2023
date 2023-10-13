import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { DiscordBot } from "@providers/discord/DiscordBot";
import { CharacterClass } from "@rpg-engine/shared";
import { Colors } from "discord.js";

import { provide } from "inversify-binding-decorators";
import nodeCron from "node-cron";

type TopCharacterEntry = {
  name: string;
  level: number;
};

type CharacterRankingClass = {
  class: CharacterClass;
  top3: TopCharacterEntry[];
};

type TopSkillEntry = {
  name: string;
  skill: string;
  level: number;
};

type CharacterRankingSkill = {
  skill: string;
  top3: TopSkillEntry[];
};

@provide(TopLevelCrons)
export class TopLevelCrons {
  constructor(private discordBot: DiscordBot) {}

  public schedule(): void {
    nodeCron.schedule("0 5 * * 0", async () => {
      await this.topLevelGlobal();
      await this.topLevelClass();
      await this.topLevelBySkillType();
    });
  }

  private async topLevelGlobal(): Promise<void> {
    const topSkill = await Skill.find({ ownerType: "Character" })
      .lean()
      .select("owner level")
      .sort({ level: -1 })
      .limit(3)
      .exec();

    const result = new Set<TopCharacterEntry>();

    for (const characterSkill of topSkill) {
      const character = await Character.findById(characterSkill.owner).lean().select("name");

      result.add({
        name: character!.name,
        level: characterSkill.level,
      });
    }

    let message = "";
    let index = 1;

    result.forEach((char) => {
      if (index <= 3) {
        message += `${index}- Name: [${char.name}] - Level: [${char.level}] \n`;
        index++;
      }
    });

    const channel = "achievements";
    const title = "Top 3 Global Level!";
    const color = Colors.Aqua;

    await this.discordBot.sendMessageWithColor(message, channel, title, color);
  }

  private async topLevelClass(): Promise<void> {
    const top3ForClass: CharacterRankingClass[] = await Character.aggregate([
      {
        $match: { class: { $in: Object.values(CharacterClass) } },
      },
      {
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skillInfo",
        },
      },
      {
        $unwind: "$skillInfo",
      },
      {
        $sort: { level: -1 },
      },
      {
        $group: {
          _id: "$class",
          topPlayers: {
            $push: {
              name: "$name",
              level: "$skillInfo.level",
            },
          },
        },
      },
      {
        $project: {
          class: "$_id",
          _id: 0,
          top3: { $slice: ["$topPlayers", 3] },
        },
      },
    ]).exec();

    const channel = "achievements";
    const color = Colors.Aqua;

    for (const ranking of top3ForClass) {
      let message = "";

      const title = `Top 3 ${ranking.class}!`;
      ranking.top3.forEach((char, index) => {
        message += `${index + 1}- Name: [${char.name}] - Level: [${char.level}]\n`;
      });

      await this.discordBot.sendMessageWithColor(message, channel, title, color);
    }
  }

  private async topLevelBySkillType(): Promise<void> {
    const skills = [
      "stamina",
      "magic",
      "magicResistance",
      "strength",
      "resistance",
      "dexterity",
      "first",
      "club",
      "sword",
      "axe",
      "distance",
      "shielding",
      "dagger",
      "fishing",
      "mining",
      "lumberjacking",
      "cooking",
      "alchemy",
      "blacksmithing",
    ];

    const top3ForAllSkills: CharacterRankingSkill[] = [];

    for (const skill of skills) {
      const top3ForSkill = await Skill.aggregate([
        {
          $lookup: {
            from: "characters",
            localField: "owner",
            foreignField: "_id",
            as: "characterInfo",
          },
        },
        {
          $unwind: "$characterInfo",
        },
        {
          $sort: { [`${skill}.level`]: -1 },
        },
        {
          $limit: 3,
        },
        {
          $project: {
            _id: 0,
            name: "$characterInfo.name",
            skill: skill,
            level: `$${skill}.level`,
          },
        },
      ]).exec();

      top3ForAllSkills.push({ skill: skill, top3: top3ForSkill });
    }

    const channel = "achievements";
    const color = Colors.Aqua;

    for (const ranking of top3ForAllSkills) {
      let message = "";

      const title = `Top 3 ${ranking.skill.charAt(0).toUpperCase() + ranking.skill.slice(1)} Skill!`;
      ranking.top3.forEach((char, index) => {
        message += `${index + 1}- Name: [${char.name}] - Level: [${char.level}]\n`;
      });

      await this.discordBot.sendMessageWithColor(message, channel, title, color);
    }
  }
}
