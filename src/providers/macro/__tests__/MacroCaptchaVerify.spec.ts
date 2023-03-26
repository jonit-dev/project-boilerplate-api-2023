import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { MacroCaptchaVerify } from "../MacroCaptchaVerify";

describe("MacroCaptchaVerify.ts", () => {
  let testCharacter: ICharacter;
  let macroCaptchaVerify: MacroCaptchaVerify;
  let sendErrorMessageToCharacter: any;
  let handleSuccessVerify: any;
  let handleVerifyBan: any;
  let handleDecreaseCaptchaTries: any;

  beforeAll(() => {
    macroCaptchaVerify = container.get<MacroCaptchaVerify>(MacroCaptchaVerify);
    // @ts-ignore
    sendErrorMessageToCharacter = jest.spyOn(macroCaptchaVerify.socketMessaging, "sendErrorMessageToCharacter" as any);
    // @ts-ignore
    handleSuccessVerify = jest.spyOn(macroCaptchaVerify, "handleSuccessVerify" as any);
    // @ts-ignore
    handleVerifyBan = jest.spyOn(macroCaptchaVerify, "handleVerifyBan" as any);
    // @ts-ignore
    handleDecreaseCaptchaTries = jest.spyOn(macroCaptchaVerify, "handleDecreaseCaptchaTries" as any);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });
  });

  it("should stop verification if user doesn't have any captcha ongoing", async () => {
    const captchaVerification = await macroCaptchaVerify.startCaptchaVerification(testCharacter, "test");

    expect(captchaVerification).toBe(false);
    expect(sendErrorMessageToCharacter).toBeCalled();
  });

  it("should verify succesfully if code provided is the same as captcha", async () => {
    testCharacter.captchaVerifyCode = "abcdef";
    testCharacter.captchaTriesLeft = 5;
    await testCharacter.save();

    const captchaVerification = await macroCaptchaVerify.startCaptchaVerification(testCharacter, "abcdef");

    expect(captchaVerification).toBe(true);
    // @ts-ignore
    expect(handleSuccessVerify).toBeCalled();
  });

  it("should ban if no tries are left", async () => {
    testCharacter.captchaVerifyCode = "abcdef";
    testCharacter.captchaTriesLeft = 1;
    await testCharacter.save();

    const captchaVerification = await macroCaptchaVerify.startCaptchaVerification(testCharacter, "aaaaaa");

    expect(captchaVerification).toBe(true);
    // @ts-ignore
    expect(handleVerifyBan).toBeCalled();
  });

  it("should decrease tries if code is invalid", async () => {
    testCharacter.captchaVerifyCode = "abcdef";
    testCharacter.captchaTriesLeft = 5;
    await testCharacter.save();

    const captchaVerification = await macroCaptchaVerify.startCaptchaVerification(testCharacter, "aaaaaa");

    expect(captchaVerification).toBe(true);
    // @ts-ignore
    expect(handleDecreaseCaptchaTries).toBeCalled();
  });
});
