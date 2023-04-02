import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { MacroCaptchaCheck } from "../MacroCaptchaCheck";

describe("MacroCaptchaCheck.ts", () => {
  let testCharacter: ICharacter;
  let macroCaptchaCheck: MacroCaptchaCheck;
  let sendEventToUser: any;

  beforeAll(() => {
    macroCaptchaCheck = container.get<MacroCaptchaCheck>(MacroCaptchaCheck);
    // @ts-ignore
    sendEventToUser = jest.spyOn(macroCaptchaCheck.socketMessaging, "sendEventToUser" as any);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
  });

  it("should not return any captcha to verify if the character doesn't have any captcha going", async () => {
    const isCaptchaDetected = await macroCaptchaCheck.checkIfCharacterHasCaptchaVerification(testCharacter);

    expect(isCaptchaDetected).toBe(false);
  });

  it("should generate and send captcha to character with ongoing verification", async () => {
    testCharacter.captchaVerifyCode = "abcdef";
    testCharacter.captchaTriesLeft = 5;
    testCharacter.captchaVerifyDate = new Date();
    await testCharacter.save();

    const isCaptchaDetected = await macroCaptchaCheck.checkIfCharacterHasCaptchaVerification(testCharacter);

    expect(isCaptchaDetected).toBe(true);
    expect(sendEventToUser).toBeCalled();
  });
});
