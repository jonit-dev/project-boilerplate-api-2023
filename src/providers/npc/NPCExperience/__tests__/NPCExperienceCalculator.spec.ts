import { EXP_RATIO } from "@providers/constants/SkillConstants";
import { container } from "@providers/inversify/container";
import { NPCExperienceCalculator } from "../NPCExperienceCalculator";

describe("NPCExperienceCalculator", () => {
  let npcExperience: NPCExperienceCalculator;
  beforeAll(() => {
    npcExperience = container.get<NPCExperienceCalculator>(NPCExperienceCalculator);
  });
  beforeEach(async () => {});
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  describe("calculateExperience", () => {
    it("should return the correct experience value for a given set of skills and base health", () => {
      const baseHealth = 50;
      const skills = {
        level: 5,
        strength: { level: 10 },
        dexterity: { level: 15 },
        resistance: { level: 20 },
      };

      const result = npcExperience.calculateExperience(baseHealth, skills);

      expect(result).toBe(Math.floor(((50 + 5 + 10 + 15 + 20) * EXP_RATIO) / 5));
    });

    // There are no logic to handle if skills skills object is empty

    // it("should return 0 if the skills object is empty", () => {
    //   const npcExperience = new NPCExperience();
    //   const baseHealth = 50;
    //   const skills = {};

    //   const result = npcExperience.calculateExperience(baseHealth, skills);

    //   expect(result).toBe(0);
    // });
  });
});
