import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container, unitTestHelper } from "@providers/inversify/container";
import { NamespaceRedisControl } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { CharacterClass, SpellsBlueprint } from "@rpg-engine/shared";
import { Types } from "mongoose";
import { Bloodthirst } from "../Bloodthirst";

describe("Bloodthirst", () => {
  let testCharacter: ICharacter;
  let inMemoryHashTable: InMemoryHashTable;
  let bloodthirst: Bloodthirst;

  beforeEach(async () => {
    inMemoryHashTable = container.get<InMemoryHashTable>(InMemoryHashTable);

    bloodthirst = container.get<Bloodthirst>(Bloodthirst);

    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should heal a berserker character when applyBerserkerBloodthirst is called", async () => {
    testCharacter.health = 90;
    testCharacter.class = CharacterClass.Berserker;
    (await Character.findByIdAndUpdate(testCharacter._id, testCharacter)) as ICharacter;

    // @ts-ignore
    await bloodthirst.applyBerserkerBloodthirst(testCharacter, 50);
    const updatedCharacter = (await Character.findById(testCharacter._id).lean().select("health")) as ICharacter;

    expect(updatedCharacter.health).toBe(100);
  });

  it("should return true when getBerserkerBloodthirstSpell is called with an existing spell", async () => {
    const characterId = Types.ObjectId();
    const namespace = `${NamespaceRedisControl.CharacterSpell}:${characterId}`;
    const key = SpellsBlueprint.BerserkerBloodthirst;
    await inMemoryHashTable.set(namespace, key, true);

    // @ts-ignore
    const spellActivated = await bloodthirst.getBerserkerBloodthirstSpell(characterId);
    expect(spellActivated).toBe(true);
  });

  it("should not heal a character if it is not a berserker when applyBerserkerBloodthirst is called", async () => {
    const initialHealth = testCharacter.health;
    testCharacter.class = CharacterClass.Druid;
    (await Character.findByIdAndUpdate(testCharacter._id, testCharacter).lean()) as ICharacter;

    // @ts-ignore
    await bloodthirst.applyBerserkerBloodthirst(testCharacter._id, 50);
    const updatedCharacter = (await Character.findById(testCharacter._id).lean().select("health")) as ICharacter;
    expect(updatedCharacter.health).toEqual(initialHealth);
  });

  it("should full health a character if the healing would surpass the maximum health", async () => {
    testCharacter.maxHealth = 100;
    testCharacter.health = 90;
    testCharacter.class = CharacterClass.Berserker;
    (await Character.findByIdAndUpdate(testCharacter._id, testCharacter).lean()) as ICharacter;

    // @ts-ignore
    await bloodthirst.applyBerserkerBloodthirst(testCharacter, 10000);
    const updatedCharacter = (await Character.findById(testCharacter._id).lean().select("health")) as ICharacter;

    expect(updatedCharacter.health).toEqual(testCharacter.maxHealth);
  });

  it("should not handle a berserker attack if the character is not a berserker", async () => {
    const initialHealth = testCharacter.health;
    (await Character.findByIdAndUpdate(testCharacter._id, { class: CharacterClass.Sorcerer }).lean()) as ICharacter;

    // @ts-ignore
    await bloodthirst.handleBerserkerAttack(testCharacter._id, 50);
    const updatedCharacter = (await Character.findById(testCharacter._id).lean().select("health")) as ICharacter;
    expect(updatedCharacter.health).toEqual(initialHealth);
  });
});
