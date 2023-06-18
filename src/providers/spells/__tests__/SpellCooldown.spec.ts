import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, inMemoryHashTable, unitTestHelper } from "@providers/inversify/container";
import { SpellCast } from "../SpellCast";
import SpellCoolDown from "../SpellCooldown";
import { spellGreaterHealing } from "../data/blueprints/all/SpellGreaterHealing";
import { spellSelfHealing } from "../data/blueprints/all/SpellSelfHealing";
import { NamespaceRedisControl } from "../data/types/SpellsBlueprintTypes";

describe("SpellCooldown", () => {
  let testCharacter: ICharacter;
  let characterSkills: ISkill;
  let spellCoolDown: SpellCoolDown;
  let spellCast: SpellCast;

  beforeAll(() => {
    spellCoolDown = container.get<SpellCoolDown>(SpellCoolDown);
    spellCast = container.get<SpellCast>(SpellCast);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      {
        learnedSpells: [spellSelfHealing.key, spellGreaterHealing.key],
      },
      { hasSkills: true }
    );

    const skills = (await Skill.findById(testCharacter.skills).lean().select("level magic")) as ISkill;
    characterSkills = skills;
    characterSkills.level = spellGreaterHealing.minLevelRequired!;
    characterSkills.magic.level = spellGreaterHealing.minMagicLevelRequired;
    (await Skill.findByIdAndUpdate(characterSkills._id, characterSkills).lean()) as ISkill;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("Should set a cooldown and return true.", async () => {
    const characterId = testCharacter._id;
    const magicWords = spellSelfHealing.magicWords;
    const cooldown = 10;

    const spellCooldown = await spellCoolDown.setSpellCooldown(characterId, magicWords!, cooldown);

    expect(spellCooldown).toBeTruthy();
  });

  it("An error should be thrown for an invalid characterId", async () => {
    const characterId = "invalid-id";
    const magicWords = spellSelfHealing.magicWords;
    const cooldown = 10;

    await expect(spellCoolDown.setSpellCooldown(characterId, magicWords!, cooldown)).rejects.toThrowError(
      "Invalid characterId argument"
    );
  });

  it("An error should be thrown for an empty magic world.", async () => {
    const characterId = testCharacter._id;
    const magicWords = "";
    const cooldown = 10;

    await expect(spellCoolDown.setSpellCooldown(characterId, magicWords!, cooldown)).rejects.toThrowError(
      "Invalid magicWords argument"
    );
  });

  it("Should set a cooldown and check register.", async () => {
    const characterId = testCharacter._id;
    const magicWords = spellSelfHealing.magicWords;
    const cooldown = spellSelfHealing.cooldown;

    const spellCooldown = await spellCoolDown.setSpellCooldown(characterId, magicWords!, cooldown!);

    expect(spellCooldown).toBeTruthy();

    const spellCooldownCheck = await spellCoolDown.haveSpellCooldown(characterId, magicWords!);

    expect(spellCooldownCheck).toBeTruthy();
  });

  it("Should cast self healing spell and not cast the second one due to its cooldown.", async () => {
    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeTruthy();

    expect(await spellCast.castSpell({ magicWords: "talas faenya" }, testCharacter)).toBeFalsy();

    const spellCooldownCheck = await spellCoolDown.haveSpellCooldown(testCharacter._id, "talas faenya");

    expect(spellCooldownCheck).toBeTruthy();
  });

  it("Should cast 2 distincts spells.", async () => {
    const selfHealing = spellSelfHealing.magicWords;
    expect(await spellCast.castSpell({ magicWords: selfHealing! }, testCharacter)).toBeTruthy();

    expect(await spellCoolDown.haveSpellCooldown(testCharacter._id, selfHealing!)).toBeTruthy();

    const greaterHealing = spellGreaterHealing.magicWords;
    expect(await spellCast.castSpell({ magicWords: greaterHealing! }, testCharacter)).toBeTruthy();

    expect(await spellCoolDown.haveSpellCooldown(testCharacter._id, greaterHealing!)).toBeTruthy();
  });

  it("Should cast spell and check the cooldown.", async () => {
    const magicWords = "talas faenya";
    expect(await spellCast.castSpell({ magicWords: magicWords }, testCharacter)).toBeTruthy();

    const spellCooldownCheck = await spellCoolDown.haveSpellCooldown(testCharacter._id, magicWords);

    expect(spellCooldownCheck).toBeTruthy();

    const regexMagicWords = magicWords.toLocaleLowerCase().replace(/\s+/g, "_");
    const namespace = `${NamespaceRedisControl.CharacterSpellCoolDown}:${testCharacter._id}:${regexMagicWords}`;

    const cooldown = await inMemoryHashTable.get(namespace, regexMagicWords);

    expect(cooldown).toEqual(7);
  });
});
