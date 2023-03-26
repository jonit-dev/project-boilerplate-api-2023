import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { MacroCaptchaSend } from "../MacroCaptchaSend";

describe("MacroCaptchaSend.ts", () => {
  let testCharacter: ICharacter;
  let macroCaptchaSend: MacroCaptchaSend;
  let sendEventToUser: any;
  let sendErrorMessageToCharacter: any;

  beforeAll(() => {
    macroCaptchaSend = container.get<MacroCaptchaSend>(MacroCaptchaSend);
    // @ts-ignore
    sendEventToUser = jest.spyOn(macroCaptchaSend.socketMessaging, "sendEventToUser" as any);
    // @ts-ignore
    sendErrorMessageToCharacter = jest.spyOn(macroCaptchaSend.socketMessaging, "sendErrorMessageToCharacter" as any);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
  });

  it("should generate new captcha and send it to the character", async () => {
    const isCaptchaGenerated = await macroCaptchaSend.sendAndStartCaptchaVerification(testCharacter);

    expect(isCaptchaGenerated).toBe(true);
    expect(sendEventToUser).toBeCalled();
  });

  it("should not generate new captcha if character has already a captcha ongoing", async () => {
    testCharacter.captchaVerifyCode = "abcdef";
    testCharacter.captchaTriesLeft = 5;
    await testCharacter.save();

    const isCaptchaGenerated = await macroCaptchaSend.sendAndStartCaptchaVerification(testCharacter);

    expect(isCaptchaGenerated).toBe(false);
    expect(sendErrorMessageToCharacter).toBeCalled();
  });
});
