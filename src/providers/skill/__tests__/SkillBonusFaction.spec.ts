import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IControlTime } from "@entities/ModuleSystem/MapControlTimeModel";
import { unitTestHelper } from "@providers/inversify/container";
import { PeriodOfDay } from "@providers/map/types/ControlTimeTypes";
import { CharacterFactions, ShadowWalkerRaces, LifeBringerRaces } from "@rpg-engine/shared";

describe("SkillBonusLifeBringer.ts", () => {
  let characterLifeBringer: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    characterLifeBringer = await unitTestHelper.createMockCharacter(
      {
        faction: CharacterFactions.LifeBringer,
        race: LifeBringerRaces.Human,
      },
      {
        hasEquipment: true,
        hasSkills: true,
        hasInventory: true,
      }
    );

    await characterLifeBringer.populate("skills").execPopulate();
    await unitTestHelper.createMockAndEquipItens(characterLifeBringer);
  });

  it("Should apply bonus faction on Attack/Defense [ Life Bringer, Morning ] ", async () => {
    (await unitTestHelper.createWeatherControlMock(
      "06:00",
      PeriodOfDay.Morning,
      "Standard",
      new Date()
    )) as IControlTime;

    const characterSkills = characterLifeBringer.skills as unknown as ISkill;
    characterSkills.strength.level = 20;
    characterSkills.resistance.level = 20;
    characterSkills.level = 1;
    const totalAttack = await characterSkills.attack;
    const totalDefense = await characterSkills.defense;

    // 20 + 1 + 5 + 10% = 28,6
    expect(totalAttack).toEqual(28.6);
    // 20 + 1 + 38 + 10% = 64.9
    expect(totalDefense).toEqual(64.9);
  });

  it("Should Not apply bonus faction on Attack/Defense [ Life Bringer, Night ] ", async () => {
    (await unitTestHelper.createWeatherControlMock("06:00", PeriodOfDay.Night, "Standard", new Date())) as IControlTime;

    const characterSkills = characterLifeBringer.skills as unknown as ISkill;
    characterSkills.strength.level = 20;
    characterSkills.resistance.level = 20;
    characterSkills.level = 1;
    const totalAttack = await characterSkills.attack;
    const totalDefense = await characterSkills.defense;

    // 20 + 1 + 5 = 26
    expect(totalAttack).toEqual(26);
    // 20 + 1 + 38 = 59
    expect(totalDefense).toEqual(59);
  });

  it("Should Not Apply bonus faction on Attack/Defense [ Life Bringer, Afternoon ]", async () => {
    (await unitTestHelper.createWeatherControlMock(
      "06:00",
      PeriodOfDay.Afternoon,
      "Standard",
      new Date()
    )) as IControlTime;

    const lifeBringerSkills = characterLifeBringer.skills as unknown as ISkill;
    lifeBringerSkills.strength.level = 20;
    lifeBringerSkills.resistance.level = 20;
    lifeBringerSkills.level = 1;
    const totalAttackLifeBringer = await lifeBringerSkills.attack;
    const totalDefenseLifeBringer = await lifeBringerSkills.defense;

    // 20 + 1 + 5 = 26
    expect(totalAttackLifeBringer).toEqual(26);
    // 20 + 1 + 38 = 59
    expect(totalDefenseLifeBringer).toEqual(59);
  });

  it("If you don't have a Sword/Armor. Faction bonus must not be activated for Attack/Defense [ Life Bringer, Morning ]", async () => {
    (await unitTestHelper.createWeatherControlMock(
      "06:00",
      PeriodOfDay.Morning,
      "Standard",
      new Date()
    )) as IControlTime;

    const characterLifeBringer = await unitTestHelper.createMockCharacter(
      {
        faction: CharacterFactions.LifeBringer,
        race: LifeBringerRaces.Human,
      },
      {
        hasEquipment: true,
        hasSkills: true,
      }
    );

    await characterLifeBringer.populate("skills").execPopulate();

    const lifeBringerSkills = characterLifeBringer.skills as unknown as ISkill;
    lifeBringerSkills.strength.level = 20;
    lifeBringerSkills.resistance.level = 20;
    lifeBringerSkills.level = 1;
    const totalAttackLifeBringer = await lifeBringerSkills.attack;
    const totalDefenseLifeBringer = await lifeBringerSkills.defense;

    // 20 + 1 = 21
    expect(totalAttackLifeBringer).toEqual(21);
    // 20 + 1 = 21
    expect(totalDefenseLifeBringer).toEqual(21);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});

describe("SkillBonusShadowWalker.ts", () => {
  let characterShadowWalker: ICharacter;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    characterShadowWalker = await unitTestHelper.createMockCharacter(
      {
        faction: CharacterFactions.ShadowWalker,
        race: ShadowWalkerRaces.Orc,
      },
      {
        hasEquipment: true,
        hasSkills: true,
        hasInventory: true,
      }
    );

    await characterShadowWalker.populate("skills").execPopulate();
    await unitTestHelper.createMockAndEquipItens(characterShadowWalker);
  });

  it("Should apply bonus faction on Attack/Defense [ Shadow Walker, Night ] ", async () => {
    (await unitTestHelper.createWeatherControlMock("06:00", PeriodOfDay.Night, "Standard", new Date())) as IControlTime;

    const characterSkills = characterShadowWalker.skills as unknown as ISkill;
    characterSkills.strength.level = 20;
    characterSkills.resistance.level = 20;
    characterSkills.level = 1;
    const totalAttack = await characterSkills.attack;
    const totalDefense = await characterSkills.defense;

    // 20 + 1 + 5 + 10% = 28,6
    expect(totalAttack).toEqual(28.6);
    // 20 + 1 + 38 + 10% = 64.9
    expect(totalDefense).toEqual(64.9);
  });

  it("Should Not apply bonus faction on Attack/Defense [ Shadow Walker, Morning ] ", async () => {
    (await unitTestHelper.createWeatherControlMock(
      "06:00",
      PeriodOfDay.Morning,
      "Standard",
      new Date()
    )) as IControlTime;

    const characterSkills = characterShadowWalker.skills as unknown as ISkill;
    characterSkills.strength.level = 20;
    characterSkills.resistance.level = 20;
    characterSkills.level = 1;
    const totalAttack = await characterSkills.attack;
    const totalDefense = await characterSkills.defense;

    // 20 + 1 + 5 = 26
    expect(totalAttack).toEqual(26);
    // 20 + 1 + 38 = 59
    expect(totalDefense).toEqual(59);
  });

  it("Should Not Apply bonus faction on Attack/Defense [ Shadow Walker, Afternoon ]", async () => {
    (await unitTestHelper.createWeatherControlMock(
      "06:00",
      PeriodOfDay.Afternoon,
      "Standard",
      new Date()
    )) as IControlTime;

    const shadowWalkerSkills = characterShadowWalker.skills as unknown as ISkill;
    shadowWalkerSkills.strength.level = 20;
    shadowWalkerSkills.resistance.level = 20;
    shadowWalkerSkills.level = 1;
    const totalAttackShadowWalker = await shadowWalkerSkills.attack;
    const totalDefenseShadowWalker = await shadowWalkerSkills.defense;

    // 20 + 1 + 5 = 26
    expect(totalAttackShadowWalker).toEqual(26);
    // 20 + 1 + 38 = 59
    expect(totalDefenseShadowWalker).toEqual(59);
  });

  it("If you don't have a Sword/Armor. And the faction bonus is not activated for Attack/Defend [ Shadow Walker, Night ] ", async () => {
    (await unitTestHelper.createWeatherControlMock("06:00", PeriodOfDay.Night, "Standard", new Date())) as IControlTime;

    const characterWithoutEquipament = await unitTestHelper.createMockCharacter(
      {
        faction: CharacterFactions.ShadowWalker,
        race: ShadowWalkerRaces.Orc,
      },
      {
        hasEquipment: true,
        hasSkills: true,
      }
    );

    await characterWithoutEquipament.populate("skills").execPopulate();

    const characterSkills = characterWithoutEquipament.skills as unknown as ISkill;
    characterSkills.strength.level = 20;
    characterSkills.resistance.level = 20;
    characterSkills.level = 1;
    const totalAttack = await characterSkills.attack;
    const totalDefense = await characterSkills.defense;

    // 20 + 1 = 21
    expect(totalAttack).toEqual(21);
    // 20 + 1 = 21
    expect(totalDefense).toEqual(21);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
