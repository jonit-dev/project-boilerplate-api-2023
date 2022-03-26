import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { INPC, NPC } from "@entities/ModuleSystem/NPCModel";
import { characterMock } from "@providers/unitTests/mock/characterMock";
import { mockNPC } from "@providers/unitTests/mock/NPCMock";
import { provide } from "inversify-binding-decorators";

@provide(UnitTestHelper)
export class UnitTestHelper {
  public async getMockNPC(): Promise<INPC> {
    let testNPC = await NPC.findOne({ key: mockNPC.key });

    if (!testNPC) {
      testNPC = new NPC(mockNPC);
      await testNPC.save();
    }

    return testNPC;
  }

  public async getMockCharacter(): Promise<ICharacter> {
    let testCharacter = await Character.findOne({ name: "Test Character" });

    if (!testCharacter) {
      testCharacter = new Character(characterMock);
      await testCharacter.save();
    }

    return testCharacter;
  }
}
