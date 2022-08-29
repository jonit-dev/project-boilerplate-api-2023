/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ITSDecorator } from "@providers/constants/ValidationConstants";
import { unitTestHelper } from "@providers/inversify/container";
import { IValidationTranslation } from "@providers/types/ValidationTypes";
import { TranslationTypes } from "@rpg-engine/shared";
import { ReadChatLogUseCase } from "@useCases/ModuleSystem/chat/readChatLog/ReadChatLogUseCase";
import { ValidationArguments } from "class-validator";

class TsDefaultDecoratorMockTest implements ITSDecorator {
  getTranslation(context: TranslationTypes, key: string, optionalParams?: any): IValidationTranslation {
    return {
      message({ property }: ValidationArguments): string {
        return `error ${property.toUpperCase()}`;
      },
    };
  }
}

describe("ReadChatLogUseCase.ts", () => {
  let emitter: ICharacter;
  let readChatLogUseCase: ReadChatLogUseCase;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    emitter = await unitTestHelper.createMockCharacter();
    await unitTestHelper.createMockChatLogs(emitter);
  });

  it("should throw error when X position value empty", async () => {
    const socketTransmissionZone = unitTestHelper.createMockSocketTransmissionZone(100, 100, 600, 600);
    const tsDecoratorTest = new TsDefaultDecoratorMockTest();

    readChatLogUseCase = new ReadChatLogUseCase(socketTransmissionZone, tsDecoratorTest);

    await expect(readChatLogUseCase.getChatLogInZone({})).rejects.toThrowError("error X");
  });

  it("should throw error when X position value not a number", async () => {
    const socketTransmissionZone = unitTestHelper.createMockSocketTransmissionZone(100, 100, 600, 600);
    const tsDecoratorTest = new TsDefaultDecoratorMockTest();
    readChatLogUseCase = new ReadChatLogUseCase(socketTransmissionZone, tsDecoratorTest);

    await expect(readChatLogUseCase.getChatLogInZone({ x: "a" })).rejects.toThrowError("error X");
  });

  it("should throw error when Y position value empty", async () => {
    const socketTransmissionZone = unitTestHelper.createMockSocketTransmissionZone(100, 100, 600, 600);
    const tsDecoratorTest = new TsDefaultDecoratorMockTest();
    readChatLogUseCase = new ReadChatLogUseCase(socketTransmissionZone, tsDecoratorTest);

    await expect(readChatLogUseCase.getChatLogInZone({ x: 10 })).rejects.toThrowError("error Y");
  });

  it("should throw error when Y position value not a number", async () => {
    const socketTransmissionZone = unitTestHelper.createMockSocketTransmissionZone(100, 100, 600, 600);
    const tsDecoratorTest = new TsDefaultDecoratorMockTest();
    readChatLogUseCase = new ReadChatLogUseCase(socketTransmissionZone, tsDecoratorTest);

    await expect(readChatLogUseCase.getChatLogInZone({ x: 10, y: "a" })).rejects.toThrowError("error Y");
  });

  it("should throw error when SCENE value empty", async () => {
    const socketTransmissionZone = unitTestHelper.createMockSocketTransmissionZone(100, 100, 600, 600);
    const tsDecoratorTest = new TsDefaultDecoratorMockTest();
    readChatLogUseCase = new ReadChatLogUseCase(socketTransmissionZone, tsDecoratorTest);

    await expect(readChatLogUseCase.getChatLogInZone({ x: 10, y: 20 })).rejects.toThrowError("error SCENE");
  });

  it("should throw error when LIMIT value not a number", async () => {
    const socketTransmissionZone = unitTestHelper.createMockSocketTransmissionZone(100, 100, 600, 600);
    const tsDecoratorTest = new TsDefaultDecoratorMockTest();
    readChatLogUseCase = new ReadChatLogUseCase(socketTransmissionZone, tsDecoratorTest);

    await expect(
      readChatLogUseCase.getChatLogInZone({ x: 10, y: 20, scene: "example", limit: "s" })
    ).rejects.toThrowError("error LIMIT");
  });

  it("should return the last 5 chat Logs in Zone", async () => {
    const socketTransmissionZone = unitTestHelper.createMockSocketTransmissionZone(100, 100, 600, 600);
    const tsDecoratorTest = new TsDefaultDecoratorMockTest();
    readChatLogUseCase = new ReadChatLogUseCase(socketTransmissionZone, tsDecoratorTest);

    const chatLogs = await readChatLogUseCase.getChatLogInZone({ x: 10, y: 20, scene: "example", limit: 5 });

    const lastResultExpected = {
      _id: "6285a2cc487abf002f1bb1ec",
      type: "Global",
      message: "Mensagem 6",
      emitter: {
        _id: emitter._id,
        name: "Test Character",
      },
      x: 150,
      y: 400,
      scene: "example",
      createdAt: new Date("2022-05-19T01:52:12.156Z"),
      updatedAt: new Date("2022-05-19T01:52:12.156Z"),
      __v: 0,
    };

    const lastResultReceived = chatLogs[chatLogs.length - 1];

    expect(chatLogs.length).toBe(5);
    expect(lastResultReceived.type).toEqual(lastResultExpected.type);
    expect(lastResultReceived.message).toBe(lastResultExpected.message);
    expect(lastResultReceived.emitter._id).toEqual(lastResultExpected.emitter._id);
    expect(lastResultReceived.emitter.name).toBe(lastResultExpected.emitter.name);
    expect(lastResultReceived.createdAt).toEqual(lastResultExpected.createdAt);
    expect(lastResultReceived.updatedAt).toEqual(lastResultExpected.updatedAt);
  });

  it("should not return chat logs if user in different scene", async () => {
    const socketTransmissionZone = unitTestHelper.createMockSocketTransmissionZone(100, 100, 600, 600);
    const tsDecoratorTest = new TsDefaultDecoratorMockTest();
    readChatLogUseCase = new ReadChatLogUseCase(socketTransmissionZone, tsDecoratorTest);

    const chatLogs = await readChatLogUseCase.getChatLogInZone({ x: 10, y: 20, scene: "CastleScene", limit: 5 });

    expect(chatLogs.length).toBe(0);
  });

  it("should not return chat logs if user outside zone", async () => {
    const socketTransmissionZone = unitTestHelper.createMockSocketTransmissionZone(100, 100, 200, 200);
    const tsDecoratorTest = new TsDefaultDecoratorMockTest();
    readChatLogUseCase = new ReadChatLogUseCase(socketTransmissionZone, tsDecoratorTest);

    const chatLogs = await readChatLogUseCase.getChatLogInZone({ x: 300, y: 200, scene: "example", limit: 5 });

    expect(chatLogs.length).toBe(0);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
