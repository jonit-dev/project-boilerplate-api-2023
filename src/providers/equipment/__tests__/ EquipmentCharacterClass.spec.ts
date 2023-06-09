import { container } from "@providers/inversify/container";
import { EquipmentCharacterClass } from "../ EquipmentCharacterClass";

describe("EquipmentCharacterClass.spec.ts", () => {
  let equipmentCharacterClass: EquipmentCharacterClass;

  beforeAll(() => {
    equipmentCharacterClass = container.get<EquipmentCharacterClass>(EquipmentCharacterClass);
  });

  it("should allow a Berserker to equip Shield, Sword, Mace, Dagger, and Axe", () => {
    ["Shield", "Sword", "Mace", "Dagger", "Axe"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Berserker", subType);
      expect(isAllowed).toBeTruthy();
    });
  });

  it("should allow a Warrior to equip Shield, Sword, Mace, Dagger, and Axe", () => {
    ["Shield", "Sword", "Mace", "Dagger", "Axe"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Warrior", subType);
      expect(isAllowed).toBeTruthy();
    });
  });

  it("should allow a Rogue to equip Sword, Shield, and Dagger", () => {
    ["Sword", "Shield", "Dagger"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Rogue", subType);
      expect(isAllowed).toBeTruthy();
    });
  });

  it("should allow a Druid to equip Staff, Book, and Mace", () => {
    ["Staff", "Book", "Mace"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Druid", subType);
      expect(isAllowed).toBeTruthy();
    });
  });

  it("should allow a Sorcerer to equip Staff, Book, and Dagger", () => {
    ["Staff", "Book", "Dagger"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Sorcerer", subType);
      expect(isAllowed).toBeTruthy();
    });
  });

  it("should allow a Hunter to equip Ranged, Spear, and Shield", () => {
    ["Ranged", "Spear", "Shield"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Hunter", subType);
      expect(isAllowed).toBeTruthy();
    });
  });

  it("should not allow a Berserker to equip Staff, Book, Ranged, Spear", () => {
    ["Staff", "Book", "Ranged", "Spear"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Berserker", subType);
      expect(isAllowed).toBeFalsy();
    });
  });

  it("should not allow a Warrior to equip Staff, Book, Ranged, Spear", () => {
    ["Staff", "Book", "Ranged", "Spear"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Warrior", subType);
      expect(isAllowed).toBeFalsy();
    });
  });

  it("should not allow a Rogue to equip Mace, Axe, Staff, Book, Ranged, Spear", () => {
    ["Mace", "Axe", "Staff", "Book", "Ranged", "Spear"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Rogue", subType);
      expect(isAllowed).toBeFalsy();
    });
  });

  it("should not allow a Druid to equip Shield, Sword, Dagger, Axe, Ranged, Spear", () => {
    ["Shield", "Sword", "Dagger", "Axe", "Ranged", "Spear"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Druid", subType);
      expect(isAllowed).toBeFalsy();
    });
  });

  it("should not allow a Sorcerer to equip Shield, Sword, Mace, Axe, Ranged, Spear", () => {
    ["Shield", "Sword", "Mace", "Axe", "Ranged", "Spear"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Sorcerer", subType);
      expect(isAllowed).toBeFalsy();
    });
  });

  it("should not allow a Hunter to equip Sword, Mace, Dagger, Axe, Staff, Book", () => {
    ["Sword", "Mace", "Dagger", "Axe", "Staff", "Book"].forEach((subType) => {
      const isAllowed = equipmentCharacterClass.isItemAllowed("Hunter", subType);
      expect(isAllowed).toBeFalsy();
    });
  });
});
