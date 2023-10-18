import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { DiscordBot } from "@providers/discord/DiscordBot";
import { CharacterClass } from "@rpg-engine/shared";
import { Colors } from "discord.js";

import { provide } from "inversify-binding-decorators";
import { CronJobScheduler } from "./CronJobScheduler";

type TopCharacterEntry = {
  name: string;
  level: number;
};

type CharacterRankingClass = {
  class: CharacterClass;
  topPlayers: Array<{ name: string; level: number }>;
};

type TopSkillEntry = {
  name: string;
  skill: string;
  level: number;
};

type CharacterRankingSkill = {
  skill: string;
  top10: TopSkillEntry[];
};

@provide(RankingCrons)
export class RankingCrons {
  constructor(private discordBot: DiscordBot, private cronJobScheduler: CronJobScheduler) {}

  public schedule(): void {
    this.cronJobScheduler.uniqueSchedule("ranking-crons", "0 0 0 0 0", async () => {
      await this.topLevelGlobal();
      await this.topLevelClass();
      await this.topLevelBySkillType();
    });
  }

  private async topLevelGlobal(): Promise<void> {
    const topSkill = await Skill.aggregate([
      {
        $lookup: {
          from: "characters",
          localField: "owner",
          foreignField: "_id",
          as: "characterInfo",
        },
      },
      { $unwind: "$characterInfo" },
      {
        $match: {
          "characterInfo.name": { $not: /^GM/ },
          ownerType: "Character",
        },
      },
      { $sort: { level: -1 } },
      { $limit: 10 },
      {
        $project: {
          owner: 1,
          level: 1,
        },
      },
    ]).exec();

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
      if (index <= 10) {
        message += `${index}- Name: [${char.name}] - Level: [${Math.round(char.level)}] \n`;
        index++;
      }
    });

    const title = "Top 10 Global Level!";

    await this.discordBot.sendMessageWithColor(message, "rankings", title, Colors.Purple);
  }

  private async topLevelClass(): Promise<void> {
    const top10ForClass: CharacterRankingClass[] = await Character.aggregate([
      {
        $match: {
          class: { $in: Object.values(CharacterClass) },
          name: { $not: /^GM/ },
        },
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
        $sort: { "skillInfo.level": -1 },
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
          topPlayers: { $slice: ["$topPlayers", 10] },
        },
      },
    ]).exec();

    const result: Record<string, CharacterRankingClass> = {};

    for (const ranking of top10ForClass) {
      if (!result[ranking.class]) {
        result[ranking.class] = { class: ranking.class, topPlayers: [] };
      }

      ranking.topPlayers.forEach((char) => {
        result[ranking.class].topPlayers.push({
          name: char.name,
          level: char.level,
        });
      });

      result[ranking.class].topPlayers.sort((a, b) => b.level - a.level);
    }

    for (const rank of Object.values(result)) {
      let message = "";
      const title = `Top 10 ${rank.class}!`;

      rank.topPlayers.forEach((char, index) => {
        message += `${index + 1}- Name: [${char.name}] - Level: [${Math.round(char.level)}]\n`;
      });

      await this.discordBot.sendMessageWithColor(message, "rankings", title, Colors.Gold);
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

    const top10ForAllSkills: CharacterRankingSkill[] = [];

    for (const skill of skills) {
      const top10ForSkill = await Skill.aggregate([
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
          $match: {
            "characterInfo.name": { $not: /GM/ },
          },
        },
        {
          $sort: { [`${skill}.level`]: -1 },
        },
        {
          $limit: 10,
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

      top10ForAllSkills.push({ skill: skill, top10: top10ForSkill });
    }

    for (const ranking of top10ForAllSkills) {
      let message = "";

      ranking.top10.sort((a, b) => b.level - a.level);

      const title = `Top 10 ${ranking.skill.charAt(0).toUpperCase() + ranking.skill.slice(1)} Skill!`;
      ranking.top10.forEach((char, index) => {
        message += `${index + 1}- Name: [${char.name}] - Level: [${char.level}]\n`;
      });

      await this.discordBot.sendMessageWithColor(message, "rankings", title, Colors.Aqua);
    }
  }
}
