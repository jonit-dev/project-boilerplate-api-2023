import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container, unitTestHelper } from "@providers/inversify/container";
import { NamespaceRedisControl, SpellsBlueprint } from "@providers/spells/data/types/SpellsBlueprintTypes";
import { CharacterClass } from "@rpg-engine/shared";
import { ManaShield } from "../ManaShield";

describe("Mana Shield", () => {
  let testCharacter: ICharacter;
  let inMemoryHashTable: InMemoryHashTable;
  let manaShield: ManaShield;

  beforeAll(() => {
    manaShield = container.get<ManaShield>(ManaShield);
    inMemoryHashTable = container.get<InMemoryHashTable>(InMemoryHashTable);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(
      {
        mana: 100,
        health: 100,
        class: CharacterClass.Sorcerer,
      },
      {
        hasSkills: true,
      }
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should return true when the spell exists", async () => {
    const namespace = `${NamespaceRedisControl.CharacterSpell}:${testCharacter._id}`;
    const key = SpellsBlueprint.ManaShield;
    await inMemoryHashTable.set(namespace, key, true);

    // @ts-ignore
    const spellActivated = await manaShield.getManaShieldSpell(testCharacter);
    expect(spellActivated).toBe(true);
  });

  it("should return false when the spell does not exist", async () => {
    // @ts-ignore
    const spellActivated = await manaShield.getManaShieldSpell(testCharacter);
    expect(spellActivated).toBe(false);
  });

  it("should apply the shield and reduce mana if there is enough mana", async () => {
    const damage = 10;

    // @ts-ignore
    const shieldApplied = await manaShield.applyManaShield(testCharacter, damage);
    const updatedCharacter = (await Character.findById(testCharacter._id).lean().select("mana")) as ICharacter;

    expect(shieldApplied).toBe(true);
    expect(updatedCharacter.mana).toBe(90);
  });

  it("should remove the shield and mana and reduce health if there is not enough mana", async () => {
    const damage = 150;

    const namespace = `${NamespaceRedisControl.CharacterSpell}:${testCharacter._id}`;
    const key = SpellsBlueprint.ManaShield;
    await inMemoryHashTable.set(namespace, key, true);

    // @ts-ignore
    const shieldApplied = await manaShield.applyManaShield(testCharacter, damage);
    const updatedCharacter = (await Character.findById(testCharacter._id).lean().select("mana health")) as ICharacter;

    const spellActivated = await manaShield.getManaShieldSpell(testCharacter);

    expect(spellActivated).toBe(false);
    expect(shieldApplied).toBe(true);
    expect(updatedCharacter.mana).toBe(0);
    expect(updatedCharacter.health).toBe(50);
  });

  it("should not apply the shield if the character does not exist", async () => {
    const damage = 10;

    // @ts-ignore
    const shieldApplied = await manaShield.handleManaShield(testCharacter._id, damage);
    expect(shieldApplied).toBe(false);
  });
});
